import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth -40;
let height = window.innerHeight -40;

const force = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.nodeID; }).strength(0.005))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width /2 , height /2));

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

//.force("link", d3.forceLink().id(function(d) { return d.nodeID; }))

class ForceDirected extends React.Component{

  constructor(props) {
    super(props);
    this.state = {

    };
    console.log("Width: " + width + " Height: " + height + " Ratio: " + (width / height)); //5760 x 1900 (ratio of 3ish)

  }

  componentWillMount() {

  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps) {
    force.nodes(nextProps.state.nodes);
    force.force("link").links(nextProps.state.links);
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  componentWillUnmount(){

  }

  renderNodes = (node) => {
    //boundary box by Tom Roth
    //https://bl.ocks.org/puzzler10/2531c035e8d514f125c4d15433f79d74
    //18th March 2017
    let transX = Math.max(rectX/2, Math.min(width - rectX/2, node.x))-(rectX/2),
        transY = Math.max(rectY/2, Math.min(height - rectY/2, node.y))-(rectY/2);
    let transform = 'translate(' + transX + ',' + transY + ')';
    return (
      <g className='node' key={node.nodeID} transform={transform}
        onMouseDown={this.onMouseStart} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseEnd}>
      <rect id={node.nodeID} width={rectX} height={rectY} fill={color(node.type)}/>
      <text x={20} dy='1.35em' dx='-.35em'>{node.nodeID}</text>
      </g>
    );
  }

  renderLinks = (link) =>{
    return (
      <line className='link' key={link.edgeID} stroke={color(1)}
        x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y} />
    );
  }

//
  render(){
    return (
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height} //-40 as for margins
      onTouchStart={(event)=>this.touchStart(event)}
      onTouchMove={(event)=>this.touchMove(event)}
      onTouchEnd={(event)=>this.touchEnd(event)}
      onTouchCancel={(event)=>this.touchCancel(event)}>
      <g>
      {this.props.state.links.length > 0 && this.props.state.links.map(this.renderLinks)}
      {this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderNodes)}
      </g>
      This Browser does not support html canvas.
      </svg>
    );
  }

  onMouseStart = (evt) => {
    let selectedElement = evt.target,
        currentX = evt.clientX,
        currentY = evt.clientY;
    console.log(selectedElement);
    let currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');

    for(let i=0; i<currentMatrix.length; i++) {
      currentMatrix[i] = parseFloat(currentMatrix[i]);
    }
    selectedElement.setAttributeNS(null, "onmousemove", this.onMouseMove);
    console.log("mouse down", selectedElement)
  }

  onMouseMove = (event) => {

  }

  onMouseEnd = (event) =>{

  }

  //change the distance of the links/edges
  changeRange(simulation ,newStrength){
    simulation.force("link").strength(+newStrength);
    simulation.alpha(1).restart();
  }

}

export default ForceDirected;
