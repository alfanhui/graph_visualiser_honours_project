import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import _ from 'lodash';
import {SET, UPDATE} from 'reducerActions';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

let radius = 20;
let rectX = 60;
let rectY = 30;
let width = window.innerWidth -40;
let height = window.innerHeight -40;

const menuItem = {fontSize:'10px', lineHeight:'15px', padding:'0px 15px', minHeight:'25px'};

const force = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.nodeID; }).strength(0.005))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width /2 , height /2));

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

const calculation = d3.scaleLinear();
calculation.domain([21000,41000]).range([0,3]);

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

//.force("link", d3.forceLink().id(function(d) { return d.nodeID; }))

class ForceDirected extends React.Component{
  
  
  
  constructor(props) {
    super(props);
    this.state = {
      currentMatrix:{}
    };
    console.log("Width: " + width + " Height: " + height + " Ratio: " + (width / height)); //5760 x 1900 (ratio of 3ish)
    
  }
  
  componentWillMount() {
    
  }
  
  componentDidMount(){
    
  }
  
  componentWillReceiveProps(nextProps) {
    nextProps.state.nodes.length > 0 && force.nodes(nextProps.state.nodes);
    nextProps.state.links.length > 0 && force.force("link").links(nextProps.state.links);
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
      <rect className="node" ref="node" id={node.nodeID} key={'node' + node.nodeID} width={rectX} height={rectY}
      fill={color(node.type)} transform={transform} onMouseDown={this.onNewMouseStart} onMouseMove={this.onNewMouseMove} onMouseUp={this.onNewMouseUp}/>
    );
  }
  
  renderLabels = (node) => {
    let transX = Math.max(rectX/2, Math.min(width - rectX/2, node.x))-(rectX/2),
    transY = Math.max(rectY/2, Math.min(height - rectY/2, node.y))-(rectY/2);
    let transform = 'translate(' + (transX+15) + ',' + (transY+20) + ')';
    return (
      <text key={'label' + node.nodeID} transform={transform}>{node.nodeID}</text>
    );
  }
  
  renderLinks = (link) =>{
    return (
      <line className='link' key={link.edgeID} stroke={color(1)}
      x1={link.source.x} y1={link.source.y + (rectY/2)} x2={link.target.x} y2={link.target.y + (rectY/2)} />
    );
  }
  
  mainMenu = (nextMenu) => {
    return(
      <foreignObject x={nextMenu.x} y={nextMenu.y}>
      <Menu desktop={true}>
      <MenuItem primaryText="Database" disabled={true}/>
      <MenuItem primaryText="Graph" disabled={true} />
      <MenuItem primaryText="Options" disabled={true} />
      </Menu>
      </foreignObject>
    );
  }
  
  elementMenu = (newMenu) => {
    return(
      <foreignObject x={nextMenu.x} y={nextMenu.y}>
      <Menu desktop={true}>
      <MenuItem style={menuItem} primaryText="Create edge" disabled={true} />
      <MenuItem style={menuItem} primaryText="Edit node" disabled={true} />
      <MenuItem style={menuItem} primaryText="Delete node" disabled={true} />
      </Menu>
      </foreignObject>
    );
  }
  
  render(){
    console.log("calc: " , calculation(36000));
    return (
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height}> //-40 as for margins
      <rect id="main"width={width} height={height} style={{fill:'white', pointerEvents:'fill', strokeWidth:'0'}}
      onMouseDown={this.onNewMouseStart} onMouseMove={this.onNewMouseMove} onMouseUp={this.onNewMouseUp}/>
      <g>
      {this.props.state.links.length > 0 && this.props.state.links.map(this.renderLinks)}
      {this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderNodes)}
      {this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderLabels)}
      </g>
      {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.mainMenu)}
      {this.props.state.mainMenu.length > 0 && this.props.state.elementMenu.map(this.elementMenu)}
      This Browser does not support html canvas.
      </svg>
    );
  }
  
  onNewMouseStart = (event) =>{
    if(event.target.getAttribute("id") == "main"){
      let newMenu = {x:event.clientX,y: event.clientY}
      this.props.dispatch(UPDATE("mainMenu", newMenu));
      console.log("main menu open");
    }else{
      if(!drag.state){
        drag.elem = event.target;
        drag.currentX = event.clientX,
        drag.currentY = event.clientY;
        let transform = event.target.getAttributeNS(null, "transform").slice(10,-1).split(',');
        drag.transform = transform.map(parseFloat);
        drag.state = true;
      }
      return false;
    }
  }
  
  onNewMouseMove =(event) => {
    if (drag.state) {
      drag.moved = true;
      let node = _.find(this.props.state.nodes, {"nodeID": drag.elem.getAttribute("id")})
      node.x = drag.transform[0] += event.clientX - drag.currentX;
      node.y = drag.transform[1] += event.clientY - drag.currentY;
      let node_props = this.updateNode(this.props.state.nodes, {"nodeID": drag.elem.getAttribute("id")}, node);
      this.props.dispatch(SET("nodes", node_props));
      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
    }
  }
  
  //https://stackoverflow.com/questions/27641731/is-there-a-function-in-lodash-to-replace-matched-item
  //24th of Dec 2014 at 20:24
  //User dfsq from stackoverflow
  updateNode (arr, key, newval) {
    let match = _.find(arr, key);
    match ? arr.splice(_.findIndex(arr, key), 1, newval) : arr.push(newval);
    return arr;
  }
  
  onNewMouseUp =(event) => {
    if (drag.state) { //had hit element
      if(!drag.moved){
        let newMenu = {x:event.clientX,y: event.clientY}
        this.props.dispatch(UPDATE("elementMenu", newMenu));
        console.log("element menu open");
      }
      drag.state = drag.moved = false;
    }
  }
  
  
  //change the distance of the links/edges
  changeRange(simulation ,newStrength){
    simulation.force("link").strength(+newStrength);
    simulation.alpha(1).restart();
  }
  
}

export default ForceDirected;
