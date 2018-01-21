import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import { SET, UPDATE } from 'reducerActions';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

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
    
  }
  
  componentWillUnmount() {
    
  }
  
  
  
  
  renderNodes = (node) => {
    let transform = 'translate(' + node.x + ',' + node.y + ')';
    let transformLabel = 'translate(' + (node.x + 10) + ',' + (node.y +20) + ')';
    return (
      <g key={"group" + node.nodeID}  >
      <rect ref="node" id={node.nodeID} key={'node' + node.nodeID} width={rectX} height={rectY}
      fill={color(node.type)} transform={transform} 
      onMouseDown={(event)=>this.props.onMouseDown(event)} 
      onMouseMove={(event)=>this.props.onMouseMove(event)} 
      onMouseUp={(event)=>this.props.onMouseUp(event)} />
      <text key={'label' + node.nodeID} transform={transformLabel} >{node.nodeID}</text>
      </g>
    );
  }
  
  renderPath = (link) => {
    let d = "M" + (link.x + rectX/2) + "," + link.data.layer
    + "C" + (link.parent.x + (rectX/2)) + "," + link.data.layer
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.data.layer + rectY)
    + " " + (link.parent.x + (rectX/2)) + "," + (link.parent.data.layer + rectY);
    return (
      <path className='link' key={'label' + link.data.name + " to " + link.parent.data.name} stroke={color(1)} d={d} />
    );
  }
  /*
  
  var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });
  
  */
  renderLinks = (link) => {
    let source = _.find(this.props.state.nodes, {"nodeID": link.source});
    let target = _.find(this.props.state.nodes, {"nodeID": link.target});
    return (
      <line className='link' key={link.edgeID} stroke={color(1)}
      x1={(source.x + rectX/2)} y1={(source.y + rectY)} 
      x2={(target.x + rectX/2)} y2={target.y} />
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
      {this.props.state.layoutReady && this.props.state.links.map(this.renderLinks)}
      {this.props.state.layoutReady && this.props.state.nodes.map(this.renderNodes)}
      </g>
      {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.props.mainMenu)}
      {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map(this.props.elementMenu)}
      This Browser does not support html canvas.
      </svg>
    );
  }  
  
}

export default Layout_Tree;
