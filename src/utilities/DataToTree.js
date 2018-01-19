import {SET} from 'reducerActions';

//covnerting to tree
let childMatrixCounter; //needs to be global because of recursion
let linkHashBySource;
let linkHashByTarget;
let nodeHash;
const defaultNodeType = 'I';  //used in formatting tree, could be found automatically by the node with most type

export function convertRawToTree(nextProps) {
    let dataTree = [];
    let matrixDepth = [];
    nodeHash = {};
    childMatrixCounter = []; //needs to be global because of recursion
    linkHashBySource = {};
    linkHashByTarget = {};
    nodeHash = {};

    
    //create has of links from source (speeds up search)
    for (let link of nextProps.state.links) {
        if (!linkHashBySource.hasOwnProperty(link.source)) {
            linkHashBySource[link.source] = [];
        }
        linkHashBySource[link.source].push(link);
    }
    
    //create hash of nodes
    for (let node of nextProps.state.nodes) {
        nodeHash[node.nodeID] = node;
    }

    //find all nodes that are not of I type
    let diffNodeTypes = nextProps.state.nodes.filter(node => node.type !== defaultNodeType);
    
    //Count how many child of child links there are to get associated layer..
    //but this should apply to whole trees,  not the whole graph!
    let layerMatrix = [];
    diffNodeTypes.map((node) => {
        childMatrixCounter = [];
        let counter = linkTraversalRecurssively(node.nodeID, 1);
        layerMatrix.push(counter);
        counter = counter > 1 ? counter*2 : counter
        nodeHash[node.nodeID].layer = counter;
    });
    let totalNumOfLayers = (countUniqueNumbers(layerMatrix) * 2 + 1); //
    
    //Make all root nodes top layer as a precaution
    let rootNodes = getRootNodes(nextProps);
    rootNodes.map((rootNode) => {
        nodeHash[rootNode.nodeID].layer = totalNumOfLayers;
    })
    
    //label nodes with correct layer order
    nextProps.state.links.map((link) => {
        if(nodeHash[link.source].type !== defaultNodeType){
            nodeHash[link.target].layer = nodeHash[link.source].layer - 1;
        }else{
            nodeHash[link.source].layer = nodeHash[link.target].layer + 1;
        }
    });
    
    //convert nodeHash back to normal array
    let nodesWithLayers = [];
    for (var node in nodeHash) {
        if (nodeHash.hasOwnProperty(node)) {
            nodesWithLayers.push(nodeHash[node]);
        }
    }
    //sort nodes by layer
    let orderedNodesWithLayers = _.orderBy(nodesWithLayers, ['layer'],['asc']);
    
    //create a data tree for each root node. (hopefully we can stop the publishing of duplicate nodes upon visualising)
    rootNodes.map((rootNode)=> {
        dataTree.push({
            "name":rootNode.nodeID,
            "data":rootNode,
            //"parent": "null",
            "children":applyChildrenRecurssively(rootNode.nodeID, [])})
        });

    console.log("TREE FORMATTING FINISHED: ", dataTree);
    return dataTree;
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
            "data": nodeHash[link.target],
            //"parent": link.source,
            "children": applyChildrenRecurssively(link.target, [])});
        })
    }
    return children;
}


//Here we cycle through the links, but some nodes have multiple children, 
//so we explore these roots recursively as well and return the longest route.
function linkTraversalRecurssively(nodeID, counter) {
    if (linkHashBySource.hasOwnProperty(nodeID)) {
        linkHashBySource[nodeID].map((childNode) => {
            let numberAddition = nodeHash[childNode.target].type == defaultNodeType ?  0 : 1;
            childMatrixCounter.push(linkTraversalRecurssively(childNode.target, (counter + numberAddition)));
        });
    }
    if(childMatrixCounter.length > 0){
        counter = Math.max.apply(null, childMatrixCounter);
    }
    return counter;
}

//gets all the nodes that do not have parents
function getRootNodes(nextProps) {
    let linkHashByTarget = {};
    //create has of links from target (speeds up search)
    for (let link of nextProps.state.links) {
        linkHashByTarget[link.target] = link;
    }
    //any node not in target is a parent node
    let rootNodes = nextProps.state.nodes.filter(node => !linkHashByTarget.hasOwnProperty(node.nodeID));
    return rootNodes
}