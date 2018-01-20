import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import { SET, UPDATE } from 'reducerActions';
import {convertRawToTree} from 'utilities/DataToTree';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

let tree = d3.tree()
.size([width - 75, height]);

let dataTree = [];
let root;

let displayedNodes = {};

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class Layout_Tree extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    onMouseDown:PropTypes.func,
    onMouseMove:PropTypes.func,
    onMouseUp:PropTypes.func,
    mainMenu:PropTypes.func,
    elementMenu:PropTypes.func,
  };
  
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
    if(nextProps.state.nodes.length > 0 && nextProps.state.links.length > 0 && dataTree.length <1){
      dataTree = convertRawToTree(nextProps, height);
    }
    displayedNodes = {};
    //update
    if(dataTree.length > 0){
      let children = [];
      children.push(dataTree.map((rootNode) => {return(
        {...rootNode}
      )}
    ));
    dataTree = {
      "name":"TopLevel",
      "children":children[0]
    };
    root = d3.hierarchy(dataTree);  
    console.log("dataTree", dataTree);
    
    root = tree(root);
    
    
    /*
    let cluster = d3.cluster()
    .size([width, height]);
    
    let clusterRoot = cluster(root);
    */
    
    //.sum(function(d) { console.log("rooting d", d); return d.data.layer; })
    }
  }

  componentWillUnmount() {
    
  }



  /*

  var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

  */
  renderNodes = (node) => {
    if(node.data.name == "TopLevel" || node.data.name == undefined){
      return;
    }
    if(!displayedNodes.hasOwnProperty(node.data.nodeID)){
      console.log("new node", node.data.nodeID, node.data.scaledLayer);
      displayedNodes[node.data.nodeID] = true;
      let nodeClass = "node" + (node.children ? " node--internal" : " node--leaf");
      let transform = 'translate(' + node.x + ',' + node.data.scaledLayer + ')';
      let transformLabel = 'translate(' + (node.x + 10) + ',' + (node.data.scaledLayer +20) + ')';
      return (
        <g key={"group" + node.data.nodeID}  >
        <rect className={nodeClass} ref="node" id={node.data.name} key={'node' + node.data.nodeID} width={rectX} height={rectY}
        fill={color(node.data.type)} transform={transform} 
        onMouseDown={(event)=>this.props.onMouseDown(event)} 
        onMouseMove={(event)=>this.props.onMouseMove(event)} 
        onMouseUp={(event)=>this.props.onMouseUp(event)} />
        <text key={'label' + node.data.nodeID} transform={transformLabel} >{node.data.nodeID}</text>
        </g>
      );
    }
  }

  renderPath = (link) => {
    console.log("link", link);
    if(link.parent.data.name == "TopLevel"){
      return;
    }
    let d = "M" + (link.x + rectX/2) + "," + link.data.layer
    + "C" + (link.parent.x + (rectX/2)) + "," + link.data.layer
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.data.layer + rectY)
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.data.layer + rectY);
    return (
      <path className='link' key={'label' + link.data.name + " to " + link.parent.data.name} stroke={color(1)} d={d} />
    );
  }

  render() {
    return (
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height}>
      <rect id="main" width={width} height={height} style={{ fill: 'white', pointerEvents: 'fill', strokeWidth: '0' }}
      onMouseDown={(event)=>this.props.onMouseDown(event)} 
      onMouseMove={(event)=>this.props.onMouseMove(event)} 
      onMouseUp={(event)=>this.props.onMouseUp(event)} />
      <g>
      {dataTree.name == "TopLevel" && root.descendants().slice(1).map(this.renderPath)}
      {dataTree.name == "TopLevel" && root.descendants().map(this.renderNodes)}
      </g>
      {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.props.mainMenu)}
      {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map(this.props.elementMenu)}
      This Browser does not support html canvas.
      </svg>
    );
  }  

  }

  export default Layout_Tree;
