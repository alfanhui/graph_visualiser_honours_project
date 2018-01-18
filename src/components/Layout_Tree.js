import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import getUuid from 'uuid/v1';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const defaultNodeType = 'I';  //used in formatting tree, could be found automatically by the node with most type

const menuItem = {
  fontSize: '10px',
  lineHeight: '15px',
  padding: '0px 15px',
  minHeight: '25px',
  backgroundColor: 'white',
  position: 'fixed !important'
};


//covnerting to tree
let childMatrixCounter = [];

let dataTree = {  "name": "TopLevel",
"children": []
};

/*
const force = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.nodeID; }).strength(0.005)) //mac 0.005 // qmb -0.2
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width /2 , height /2));
*/
const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

var tree = d3.tree()
.size([height, width - 160]);

var stratify = d3.stratify()
.parentId(function (d) { return d.nodeID.substring(0, d.nodeID.lastIndexOf(".")); });

let root;

let drag = {
  elm: null,
  transform: [],
  currentX: 0,
  currentY: 0,
  state: false,
  moved: false
};

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class Layout_Tree extends React.Component {
  
  
  
  constructor(props) {
    super(props);
    this.state = {
      
    };
    console.log("Width: " + width + " Height: " + height + " Ratio: " + (width / height)); //5760 x 1900 (ratio of 3ish)
    
  }
  
  componentWillMount() {
    
  }
  
  componentDidMount() {
    
  }
  
  componentWillReceiveProps(nextProps) {
    //convert data into tree form
    nextProps.state.nodes.length > 0 && nextProps.state.links.length > 0 && this.convertRawToTree(nextProps);
    
    //update
    root = stratify(nextProps.state.nodes)
    .sort(function (a, b) { return (a.height - b.height) || a.nodeID.localeCompare(b.nodeID); });
    
    //nextProps.state.nodes.length > 0 && force.nodes(nextProps.state.nodes);
    //nextProps.state.links.length > 0 && force.force("link").links(nextProps.state.links);
    //force.on('tick', () => {
    // after force calculation starts, call
    // forceUpdate on the React component on each tick
    // this.forceUpdate()
    //});
  }
  
  componentWillUnmount() {
    
  }
  
  
  convertRawToTree(nextProps) {
    let matrixDepth = [];
    
    //create hash of links
    let linkHash = {};
    for (let link of nextProps.state.links) {
      if (!linkHash.hasOwnProperty(link.source)) {
        linkHash[link.source] = [];
      }
      linkHash[link.source].push(link);
    }
    
    //create hash of nodes
    let nodeHash = {};
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
      let counter = this.linkTraversalRecurssively(linkHash, nodeHash, node.nodeID, 1, []);
      layerMatrix.push(counter);
      counter = counter > 1 ? counter*2 : counter
      nodeHash[node.nodeID].layer = counter;
    });
    let totalNumOfLayers = (this.countUniqueNumbers(layerMatrix) * 2 + 1); //

    //Make all root nodes top layer as a precaution
    let rootNodes = this.getRootNodes(nextProps);
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
  
    //switched
    let linkHashSwitched = {};
    for (let link of nextProps.state.links) {
      if (!linkHashSwitched.hasOwnProperty(link.target)) {
        linkHashSwitched[link.target] = [];
      }
      linkHashSwitched[link.target].push(link);
    }
    //create the data tree structure
      let partTree = {
          "name":orderedNodesWithLayers[0].nodeID,
          "data":orderedNodesWithLayers[0],
          "children":this.applyChildrenRecurssively(orderedNodesWithLayers[0].nodeID, linkHashSwitched,nodeHash, [])};
      
    console.log(JSON.parse(JSON.stringify(partTree)));
  }
  
  /* https://stackoverflow.com/questions/15052702/count-unique-elements-in-array-without-sorting
  * Counting unique elements in array
  * By Web_Designer @ stackoverflow on 07/07/17
  */
  countUniqueNumbers(array) {
    return new Set(array).size;
  }

  applyChildrenRecurssively(node, linkHashSwitched,nodeHash, children){ //linkHash is using link.source
    if (linkHashSwitched.hasOwnProperty(node)){ //contains a link
      linkHashSwitched[node].map((link) => { // cycle through the exisiting links
          children = ({"name": link.source,
                      "data": nodeHash[link.source],
                      "children": this.applyChildrenRecurssively(link.source, linkHashSwitched,nodeHash, [])});
          console.log(JSON.parse(JSON.stringify(children)));
      })
    }
    return children; //look here almost there!
  }
  
  
  //Here we cycle through the links, but some nodes have multiple children, so we explore these roots recursively as well.
  linkTraversalRecurssively(linkHash,nodeHash, nodeID, counter) {
    if (linkHash.hasOwnProperty(nodeID)) {
      linkHash[nodeID].map((childNode) => {
        let numberAddition = nodeHash[childNode.target].type == defaultNodeType ?  0 : 1;
        childMatrixCounter.push(this.linkTraversalRecurssively(linkHash,nodeHash, childNode.target, (counter + numberAddition)));
      });
    }
    if(childMatrixCounter.length > 0){
      counter = Math.max.apply(null, childMatrixCounter);
    }
    return counter;
  }
  
  //gets all the nodes that do not have parents
  getRootNodes(nextProps) {
    let linkHash = {};
    for (let link of nextProps.state.links) {
      linkHash[link.target] = link;
    }
    let links = nextProps.state.links;
    //any node not in target is a parent node
    let rootNodes = nextProps.state.nodes.filter(node => !linkHash.hasOwnProperty(node.nodeID));
    console.log("PARENT NODES ARE: ", rootNodes);
    return rootNodes
  }
  
  renderNodes = (node) => {
    let nodeClass = "node" + (node.children ? " node--internal" : " node--leaf");
    let transform = 'translate(' + node.y + ',' + node.x + ')';
    return (
      <rect className={nodeClass} ref="node" id={node.nodeID} key={'node' + node.nodeID} width={rectX} height={rectY}
      fill={color(node.type)} transform={transform} onMouseDown={this.onNewMouseStart} onMouseMove={this.onNewMouseMove} onMouseUp={this.onNewMouseUp} />
    );
  }
  
  renderLabels = (node) => {
    let transX = Math.max(rectX / 2, Math.min(width - rectX / 2, node.x)) - (rectX / 2),
    transY = Math.max(rectY / 2, Math.min(height - rectY / 2, node.y)) - (rectY / 2);
    let transform = 'translate(' + (transX + 15) + ',' + (transY + 20) + ')';
    return (
      <text key={'label' + node.nodeID} transform={transform}>{node.nodeID}</text>
    );
  }
  
  renderPath = (link) => {
    let linkHorizontal = d3.linkHorizontal().x(link.y).y(link.x);
    return (
      <path className='link' key={link.edgeID} stroke={color(1)} d={linkHorizontal} />
    );
  }
  
  mainMenu = (nextMenu) => {
    let transform = 'translate(' + (nextMenu.x - 40) + ',' + (nextMenu.y - 40) + ')'; //minus margins
    return (
      <g key={"MM" + nextMenu.x + nextMenu.y} transform={transform}>
      <foreignObject width='96' height='107'>
      <Menu desktop={true}>
      <MenuItem style={menuItem} primaryText="Database" disabled={true} />
      <MenuItem style={menuItem} primaryText="Graph" disabled={true} />
      <MenuItem style={menuItem} primaryText="Options" disabled={true} />
      </Menu>
      </foreignObject>
      </g>
    );
  }
  
  elementMenu = (nextMenu) => {
    let transform = 'translate(' + (nextMenu.x - 40) + ',' + (nextMenu.y - 40) + ')'; //minus margins
    return (
      <g key={"EM" + nextMenu.x + nextMenu.y} transform={transform}>
      <foreignObject width='96' height='107'>
      <Menu desktop={true}>
      <MenuItem style={menuItem} primaryText="Create edge" disabled={true} />
      <MenuItem style={menuItem} primaryText="Edit node" disabled={true} />
      <MenuItem style={menuItem} primaryText="Delete node" disabled={true} />
      </Menu>
      </foreignObject>
      </g>
    );
  }
  
  render() {
    return (
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height}>
      <rect id="main" width={width} height={height} style={{ fill: 'white', pointerEvents: 'fill', strokeWidth: '0' }}
      onMouseDown={this.onNewMouseStart} onMouseMove={this.onNewMouseMove} onMouseUp={this.onNewMouseUp} />
      <g>
      {this.props.state.links.length > 0 && tree(root).links().map(this.renderPath)}
      {this.props.state.nodes.length > 0 && root.descendants().map(this.renderNodes)}
      {/*this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderLabels)*/}
      </g>
      {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.mainMenu)}
      {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map(this.elementMenu)}
      This Browser does not support html canvas.
      </svg>
    );
  }
  
  onNewMouseStart = (event) => {
    if (event.target.getAttribute("id") == "main") {
      let uuid = getUuid();
      let timerID = setTimeout(() => { this.timeOutMain(); }, 3000, uuid);
      let newMenu = { x: event.clientX, y: event.clientY, uuid, timerID };
      this.props.dispatch(UPDATE("mainMenu", newMenu));
      console.log("main menu open");
    } else {
      if (!drag.state) {
        drag.elem = event.target;
        drag.currentX = event.clientX,
        drag.currentY = event.clientY;
        let transform = event.target.getAttributeNS(null, "transform").slice(10, -1).split(',');
        drag.transform = transform.map(parseFloat);
        drag.state = true;
      }
      return false;
    }
  }
  
  onNewMouseMove = (event) => {
    if (drag.state) {
      drag.moved = true;
      let node = _.find(this.props.state.nodes, { "nodeID": drag.elem.getAttribute("id") })
      node.x = drag.transform[0] += event.clientX - drag.currentX;
      node.y = drag.transform[1] += event.clientY - drag.currentY;
      let node_props = this.updateNode(this.props.state.nodes, { "nodeID": drag.elem.getAttribute("id") }, node);
      this.props.dispatch(SET("nodes", node_props));
      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
    }
  }
  
  //https://stackoverflow.com/questions/27641731/is-there-a-function-in-lodash-to-replace-matched-item
  //24th of Dec 2014 at 20:24
  //User dfsq from stackoverflow
  updateNode(arr, key, newval) {
    let match = _.find(arr, key);
    match ? arr.splice(_.findIndex(arr, key), 1, newval) : arr.push(newval);
    return arr;
  }
  
  onNewMouseUp = (event) => {
    if (drag.state) { //had hit element
      if (!drag.moved) {
        let uuid = getUuid();
        let timerID = setTimeout(() => { this.timeOutElement(); }, 3000, uuid);
        let newMenu = { x: event.clientX, y: event.clientY, uuid, timerID };
        this.props.dispatch(UPDATE("elementMenu", newMenu));
        console.log("element menu open");
      }
      drag.state = drag.moved = false;
    }
  }
  
  timeOutMain = (uuid) => {
    let menu = this.props.state.mainMenu;
    const newMenu = menu.filter(obj => obj.uuid == uuid);
    console.log(newMenu);
    this.props.dispatch(SET("mainMenu", newMenu));
  }
  
  timeOutElement = (uuid) => {
    let menu = this.props.state.elementMenu;
    const newMenu = menu.filter(obj => obj.uuid == uuid);
    console.log(newMenu);
    this.props.dispatch(SET("elementMenu", newMenu));
  }
  
  
  //change the distance of the links/edges
  changeRange(simulation, newStrength) {
    simulation.force("link").strength(+newStrength);
    simulation.alpha(1).restart();
  }
  
}

export default Layout_Tree;
