import {SET} from 'reducerActions';
import * as d3 from 'd3';

//covnerting to tree
let linkHashBySource;
let linkHashByTarget;
let nodeHash;
const defaultNodeType = 'I';  //used in formatting tree, could be found automatically by the node with most type
let totalNumOfLayers = 0;

let width = window.innerWidth - 40;
let height = window.innerHeight - 40;
let tree = d3.tree()
.size([width - 75, height]);



export function convertRawToTree(object) {
    return (dispatch) => {
        let nodes = object.nodes,
            links = object.links;
        nodeHash = {};
        linkHashBySource = {};
        linkHashByTarget = {};
        nodeHash = {};
        createDataHashes(nodes, links);

        //Calculate possible depths for all nodes, starting from roots
        let rootNodes = getRootNodes(nodes);
        calculatePossibleDepths(rootNodes);
        
        //find which nodes have biggest max depth
        let nodeDepthConflict = getNodesWithMaxDepth();
        
        //recursively amend layer heights from conflicts in asceding order so we don't override higher ordered layers
        nodeDepthConflict = _.orderBy(nodeDepthConflict, ['size'],['asc']);
        nodeDepthConflict.map((childNode) =>{
            correctDepthTraversalRecurssively(childNode.nodeID, (childNode.size -1));
        })    
        
        //scale for vertical placement
        let scaleHeight = d3.scaleLinear().domain([0,totalNumOfLayers]).range([40,height-40]);  
        
        //Scale all nodes according to correct layer
        for (let node in nodeHash) {
            if (nodeHash.hasOwnProperty(node)) {
                nodeHash[node].scaleLayer = scaleHeight(nodeHash[node].layer);
            }
        }
        
        //convert nodeHash back to normal array
        let nodesWithLayers = [];
        for (let node in nodeHash) {
            if (nodeHash.hasOwnProperty(node)) {
                nodesWithLayers.push(nodeHash[node]);
            }
        }
        //sort nodes by layer
        let orderedNodesWithLayers = _.orderBy(nodesWithLayers, ['layer'],['asc']);
        
        //Structure into tree for d3
        let dataTree = structureIntoTree(rootNodes);
        
        //Apply horizontal positioning
        let root = d3.hierarchy(dataTree);  
        root = tree(root);

        let newNodes = treeIntoNodes(root);

        dispatch(SET("nodes", newNodes));
        dispatch(SET("layoutReady",true));
    }
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
}

function calculatePossibleDepths(rootNodes){
    rootNodes.map((rootNode) => {
        nodeHash[rootNode.nodeID].layer = 0;
        possibleDepthTraversalRecurssively(rootNode.nodeID, 1);
    });
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
    return nodeDepthConflict;
}

/* https://stackoverflow.com/questions/15052702/count-unique-elements-in-array-without-sorting
* Counting unique elements in array
* By Web_Designer @ stackoverflow on 07/07/17
*/
function countUniqueNumbers(array) {
    return new Set(array).size;
}

//Recursively goes through and adds correct children to each node
function applyChildrenRecurssively(node, children){ //linkHash is using link.source
    if (linkHashBySource.hasOwnProperty(node)){ //contains a link
        linkHashBySource[node].map((link) => { // cycle through the exisiting links
            children.push({"name": link.target,
            "parent": link.source,
            "children": applyChildrenRecurssively(link.target, []),
            ...nodeHash[link.target]});
        })
    }
    return children;
}

//adds suspected layer to depthLayer array
function possibleDepthTraversalRecurssively(nodeID, counter) {
    if (linkHashBySource.hasOwnProperty(nodeID)) {
        linkHashBySource[nodeID].map((childNode) => {
            nodeHash[childNode.target].depthArray.push(counter);
            nodeHash[childNode.target].layer = counter;
            possibleDepthTraversalRecurssively(childNode.target, (counter + 1));
        });
    }
}

//Adjusts layer height based off maximum layer found in child
function correctDepthTraversalRecurssively(nodeID, counter) {
    if (linkHashByTarget.hasOwnProperty(nodeID)) {
        linkHashByTarget[nodeID].map((parentNode) => {
            nodeHash[parentNode.source].layer = counter;
            correctDepthTraversalRecurssively(parentNode.source, (counter - 1));
        });
    }
}

//gets all the nodes that do not have parents
function getRootNodes(nodes) {
    //any node not in target is a parent node
    return nodes.filter(node => !linkHashByTarget.hasOwnProperty(node.nodeID));
}

function structureIntoTree(rootNodes){
    let branches = [];
    //create a data tree for each root node. (hopefully we can stop the publishing of duplicate nodes upon visualising)
    rootNodes.map((rootNode)=> {
        branches.push({
            "name":rootNode.nodeID,
            "parent": "",
            "children":applyChildrenRecurssively(rootNode.nodeID, []),
            ...rootNode})
    });

    let children = [];
    children.push(branches.map((rootNode) => {return(
        {...rootNode}
    )}));

    let dataTree = {
        "name":"TopLevel",
        "children":children[0]
    };
    return dataTree;
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
                })
            }
            if(!_.find(newNodeArray, {"nodeID": node_children.data.nodeID})){
                newNodeArray.push({
                    "nodeID":node_children.data.nodeID,
                    "type":node_children.data.type,
                    "text":node_children.data.text, 
                    "timestamp":node_children.data.timestamp,      
                    "layer":node_children.data.layer,      
                    "x":node_children.x,      
                    "y":node_children.data.scaleLayer,           
                    });
                }
        };
        if (node.children && node.children.length > 0){ 
            node.children.map((child)=>{
                findChildren(child);
            })
        }
        if(!_.find(newNodeArray, {"nodeID": node.data.nodeID})){
            newNodeArray.push({"nodeID":node.data.nodeID,
                    "text":node.data.text, 
                    "type":node.data.type,
                    "timestamp":node.data.timestamp,      
                    "layer":node.data.layer,      
                    "x":node.x,      
                    "y":node.data.scaleLayer,           
                    });
                }
    })  
    return newNodeArray;
}