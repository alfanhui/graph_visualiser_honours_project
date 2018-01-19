import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import getUuid from 'uuid/v1';
import {convertRawToTree} from 'utilities/DataToTree';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const menuItem = {
  fontSize: '10px',
  lineHeight: '15px',
  padding: '0px 15px',
  minHeight: '25px',
  backgroundColor: 'white',
  position: 'fixed !important'
};



/*
const force = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.nodeID; }).strength(0.005)) //mac 0.005 // qmb -0.2
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width /2 , height /2));
*/
const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

let tree = d3.tree()
  .size([width, height -100]);

let dataTree = [];
let root;

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
      dataTree = convertRawToTree(nextProps);
    }
    
    //update
    if(dataTree.length > 0){
      let children = [];
      children.push(dataTree.map((rootNode) => {return(
          {"name":rootNode.nodeID,
          "data":rootNode,
          "children":rootNode.children}
        )}
      ));
      dataTree = {
        "name":"TopLevel",
        "data":null,
        "children":children[0]
      };
      root = d3.hierarchy(dataTree);    
      root = tree(root);
      //root.sort(function(a, b) { return (a.height - b.height) || a.name.localeCompare(b.name); });
      //.sum(function(d) { console.log("rooting d", d); return d.data.layer; })
      
    }
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
  
  renderNodes = (node) => {
    if(node.data.name == "TopLevel"){
      return;
    }
    let nodeClass = "node" + (node.children ? " node--internal" : " node--leaf");
    let transform = 'translate(' + node.x + ',' + node.y + ')';
    let transformLabel = 'translate(' + (node.x + 10) + ',' + (node.y +20) + ')';
    return (
      <g key={"group" + node.data.data.nodeID}  >
      <rect className={nodeClass} ref="node" id={node.data.name} key={'node' + node.data.data.nodeID} width={rectX} height={rectY}
      fill={color(node.data.data.type)} transform={transform} 
      onMouseDown={(event)=>this.props.onMouseDown(event)} 
      onMouseMove={(event)=>this.props.onMouseMove(event)} 
      onMouseUp={(event)=>this.props.onMouseUp(event)} />
      <text key={'label' + node.data.data.nodeID} transform={transformLabel} >{node.data.data.nodeID}</text>
      </g>
    );
  }

  renderPath = (link) => {
    if(link.parent.data.name == "TopLevel"){
      return;
    }
    let d = "M" + (link.x + rectX/2) + "," + link.y
    + "C" + (link.parent.x + (rectX/2)) + "," + link.y
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.y + rectY)
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.y + rectY);
    return (
      <path className='link' key={'label' + link.data.name + " to " + link.parent.data.name} stroke={color(1)} d={d} />
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
           onMouseDown={(event)=>this.props.onMouseDown(event)} 
           onMouseMove={(event)=>this.props.onMouseMove(event)} 
           onMouseUp={(event)=>this.props.onMouseUp(event)} />
      <g>
      {dataTree.name == "TopLevel" && root.descendants().slice(1).map(this.renderPath)}
      {dataTree.name == "TopLevel" && root.descendants().map(this.renderNodes)}
      </g>
      {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.mainMenu)}
      {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map(this.elementMenu)}
      This Browser does not support html canvas.
      </svg>
    );
  }  
  
}

export default Layout_Tree;
