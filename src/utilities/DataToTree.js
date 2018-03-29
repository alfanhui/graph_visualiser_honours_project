import {SET} from 'reducerActions';
import * as d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';

//covnerting to tree
let linkHashBySource;
let linkHashByTarget;
let nodeHash;
let lowestNumOfLayers;
let totalNumOfLayers;

//loop protectors
let possibleLoopHash;
let correctLoopHash;
let applyChildrenLoopHash;

let width = window.innerWidth - 50;
let height = window.innerHeight - 100;
let tree = d3.tree()
.size([width - 75, height]);

export function scaleHeight(number){
    let scale = d3.scaleLinear().domain([lowestNumOfLayers,totalNumOfLayers]).range([20,height-60]);
    return scale(number);
}

export function convertRawToTree(object) {
    lowestNumOfLayers=0,
    totalNumOfLayers=0,
    nodeHash = {},
    linkHashBySource = {},
    linkHashByTarget = {};
    
    return (dispatch) => {
        if(object.nodes.length == 0){
            return;
        }
        let nodes = object.nodes,
        links = object.links;
        
        createDataHashes(nodes, links);
        
        //Calculate possible depths for all nodes, starting from roots
        let rootNodes = getRootNodes(nodes);
        calculatePossibleDepths(rootNodes);
        
        //find which nodes have biggest max depth
        let nodeDepthConflict = getNodesWithMaxDepth();
        
        //recursively amend layer heights from conflicts in asceding order so we don't override higher ordered layers
        nodeDepthConflict.map((childNode) =>{
            correctLoopHash = {};
            correctDepthTraversalRecurssively(childNode.nodeID, (childNode.size -1));
        });    
        
        fixLayerCount();
        
        //Scale all nodes according to correct layer
        if(totalNumOfLayers == 1){ //this stops long edges when adding to a 1 layer (because diff in space beween edges is huge!)
            height = (window.innerHeight - 100)/2;
        }else{
            width = window.innerWidth - 50;
            height = window.innerHeight - 100;
        }
        for (let node in nodeHash) {
            if (nodeHash.hasOwnProperty(node)) {
                nodeHash[node].y = scaleHeight(nodeHash[node].layer);
            }
        }
        
        //Structure into tree for d3
        let dataTree = structureIntoTree(rootNodes);
        
        //Apply horizontal positioning 
        let root = tree(d3.hierarchy(dataTree));
        
        let newNodes = treeIntoNodes(root);
        
        dispatch(SET("layoutReady",true));
        dispatch(SET("nodes", newNodes));
    };
}


//create hash of nodes, links by source and targets (speeds up search)
function createDataHashes(nodes, links){
    //nodes
    for (let node of nodes) {
        nodeHash[node.nodeID] = node;
        nodeHash[node.nodeID].depthArray = [];
    }
    //links by source
    for (let link of links) {
        if (!linkHashBySource.hasOwnProperty(link.source)) {
            linkHashBySource[link.source] = [];
        }
        linkHashBySource[link.source].push(link);
    }
    
    //links by target
    for (let link of links) {
        if (!linkHashByTarget.hasOwnProperty(link.target)) {
            linkHashByTarget[link.target] = [];
        }
        linkHashByTarget[link.target].push(link);
    }
    return {nodeHash, linkHashBySource, linkHashByTarget};
}

function calculatePossibleDepths(rootNodes){
    rootNodes.map((rootNode) => {
        nodeHash[rootNode.nodeID].layer = 0;
        possibleLoopHash = {};
        possibleDepthTraversalRecurssively(rootNode.nodeID, 1, nodeHash);
    });
    return rootNodes;
}


//adds suspected layer to depthLayer array
function possibleDepthTraversalRecurssively(nodeID, counter, nodeHash) {
    if (linkHashBySource.hasOwnProperty(nodeID)) {
        linkHashBySource[nodeID].map((childNode) => {
            if(possibleLoopHash.hasOwnProperty(nodeID+"_"+childNode.target)){
                return;
            }else{
                possibleLoopHash[nodeID+"_"+childNode.target] = null;
                nodeHash[childNode.target].depthArray.push(counter);
                nodeHash[childNode.target].layer = counter;
                if(nodeID !== childNode.target){
                    possibleDepthTraversalRecurssively(childNode.target, (counter + 1), nodeHash);
                }
            }
        });
    }
}


function getNodesWithMaxDepth(){
    let nodeDepthConflict = [];
    for (let node in nodeHash) {
        if (nodeHash.hasOwnProperty(node)) {
            if(nodeHash[node].depthArray.length > 1){
                let max = Math.max.apply(null, nodeHash[node].depthArray);
                nodeHash[node].layer = max;
                //if we have to choose a max, we have to cycle that through above in the array, with the biggest last 
                nodeDepthConflict.push({"nodeID": node, "size": max});
                if(max > totalNumOfLayers){
                    totalNumOfLayers = max;
                }
            }
        }
    }
    nodeDepthConflict = _.orderBy(nodeDepthConflict, ['size'],['asc']);
    return nodeDepthConflict;
}

//Adjusts layer height based off maximum layer found in child
function correctDepthTraversalRecurssively(nodeID, counter) {
    if (linkHashByTarget.hasOwnProperty(nodeID)) {
        linkHashByTarget[nodeID].map((parentNode) => {
            if(correctLoopHash.hasOwnProperty(nodeID+"_"+parentNode.source)){
                return;
            }else{
                correctLoopHash[nodeID+"_"+parentNode.source] = null;
                nodeHash[parentNode.source].layer = counter;
                correctDepthTraversalRecurssively(parentNode.source, (counter - 1));
            }
        });
    }
}

//gets all the nodes that do not have parents
function getRootNodes(nodes) {
    //any node not in target is a parent node
    let rootNodes = nodes.filter(node => !linkHashByTarget.hasOwnProperty(node.nodeID));
    if(rootNodes.length == 0){
        return [nodes[0]];
    }
    let sortedRootNodes = rootNodes.sort(function(node1, node2) {
        if(!node1.hasOwnProperty("timestamp")){
            return true;
        }
        return moment.utc(node1.timestamp).isAfter(moment.utc(node2.timestamp));
    });
    return sortedRootNodes;
}


//Because some graphs loop back on themselves, the layers can get into negative numbers. This adjusts this error.
function fixLayerCount(){
    //Correct layer count
    for (let node in nodeHash) {
        if (nodeHash.hasOwnProperty(node)) {
            if(nodeHash[node].layer < lowestNumOfLayers){
                lowestNumOfLayers = nodeHash[node].layer;
            }else if(nodeHash[node].layer > totalNumOfLayers){
                totalNumOfLayers = nodeHash[node].layer;
            }
        }
    }
    if(lowestNumOfLayers < 0){
        let positiveLowestLayer = Math.abs(lowestNumOfLayers);
        for (let node in nodeHash) {
            if (nodeHash.hasOwnProperty(node)) {
                nodeHash[node].layer += positiveLowestLayer;
            }
        }
        lowestNumOfLayers = 0;
        totalNumOfLayers += positiveLowestLayer;
    }
}

function structureIntoTree(rootNodes){
    let branches = [];
    //create a data tree for each root node. (hopefully we can stop the publishing of duplicate nodes upon visualising)
    rootNodes.map((rootNode)=> {
        applyChildrenLoopHash = {};
        branches.push({
            "name":rootNode.nodeID,
            "parent": "",
            "children":applyChildrenRecurssively(rootNode.nodeID, []),
            ...rootNode});
        });
        
        let children = [];
        children.push(branches.map((rootNode) => {return(
            {...rootNode}
        );}));
        
        let dataTree = {
            "name":"TopLevel",
            "children":children[0]
        };
        return dataTree;
    }
    
    
    //Recursively goes through and adds correct children to each node
    function applyChildrenRecurssively(node, children){ //linkHash is using link.source
        if (linkHashBySource.hasOwnProperty(node)){ //contains a link
            linkHashBySource[node].map((link) => { // cycle through the exisiting links
                if(applyChildrenLoopHash.hasOwnProperty(link.target +"_"+link.source)){
                    return;
                }else{
                    applyChildrenLoopHash[link.target +"_"+link.source] = null;
                    children.push({"name": link.target,
                    "parent": link.source,
                    "children": applyChildrenRecurssively(link.target, []),
                    ...nodeHash[link.target]});
                }
            });
        }
        return children;
    }
    
    
    
  //This converts the hierarchal data of all the root nodes and their children back into normal node data.  
  function treeIntoNodes(root){
      let newNodeArray = [];
      root.children.map((node) => { 
          //recursion function inside this function because keeping newNodeArray a local variable.
          let findChildren = function(node_children){
              if (node_children.children && node_children.children.length > 0){ 
                  node_children.children.map((child)=>{
                      findChildren(child);
                  });
              }
              if (!_.find(newNodeArray, { "nodeID": node_children.data.nodeID })) {
                  newNodeArray.push(formatNode(node_children));
              }
          };
          if (node.children && node.children.length > 0){ 
              node.children.map((child)=>{
                  findChildren(child);
              });
          }
          if(!_.find(newNodeArray, {"nodeID": node.data.nodeID})){
              newNodeArray.push(formatNode(node));
          }
    });  
    return newNodeArray;
}

//This formats the node to rid any data that is unnessary and to make all necessay properties apparent.
function formatNode(node) {
    if (!node.data.hasOwnProperty('text')) {
        node.data['text'] = "";
    }
    if (!node.data.hasOwnProperty('timestamp')) {
        node.data['timestamp'] = moment().format("YYYY-MM-DD HH:MM:SS");
    }

    let infantNode = _.cloneDeep(node.data);
    infantNode.x = node.x;

    delete (infantNode.parent);
    delete (infantNode.depthArray);

    if (infantNode.hasOwnProperty('children')) {
        delete (infantNode.children);
    }

    return infantNode;
}
