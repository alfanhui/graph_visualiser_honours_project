import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import _ from 'lodash';

let rectX = 150;
let rectY = 10;
let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

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
    //onMouseDown:PropTypes.func,
    //onMouseMove:PropTypes.func,
    //onMouseUp:PropTypes.func,
    mainMenu: PropTypes.func,
    elementMenu: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchCancel: PropTypes.func,
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
  
  componentWillReceiveProps() {
    
  }
  
  componentWillUnmount() {
    
  }
  
  renderNodes = (node) => {
    if(this.props.state.defaultNodeTypes.includes(node.type)){
      return this.renderContentNodes(node)
    }else{
      return this.renderNonContentNodes(node)
    }
  }
  
  //These nodes are the transcript elements: ie. content

  renderContentNodes = (node) => {
    let transform = 'translate(' + node.x + ',' + node.y + ')';
    return (
      <g key={"group" + node.nodeID}  >
      <rect className="node" id={node.nodeID} key={'node' + node.nodeID} width={rectX} height={rectY + (node.text.length * 15)}
      fill={color(node.type)} transform={transform}
      //onMouseDown={(event)=>this.props.onMouseDown(event)} 
      //onMouseMove={(event)=>this.props.onMouseMove(event)} 
      //onMouseUp={(event)=>this.props.onMouseUp(event)} 
      onTouchStart={(event) => this.props.onTouchStart(event)}
      onTouchMove={(event) => this.props.onTouchMove(event)}
      onTouchEnd={(event) => this.props.onTouchEnd(event)}
      onTouchCancel={(event) => this.props.onTouchCancel(event)} />
      {
        node.text.map((line, index) => {
          let transformLabel = 'translate(' + (node.x + 5) + ',' + (node.y + 15 + (index * 15)) + ')';
          return(
            <text className="ContentText" key={'label' + index + node.nodeID} transform={transformLabel} >{line}</text>
          );
        })
      }      
      </g>
    );
  }

  //Non-default are AIF added extended nodes
  renderNonContentNodes = (node) => {
    let transform = 'translate(' + (node.x - 15 + rectX/2)+ ',' + (node.y + 5) + ') rotate(45 ' +30/2 + ' ' + 30/2 + ')';
    let transformLabel = 'translate(' + (node.x - 10 + rectX/2) + ',' + (node.y + 25) + ')';
    return (
      <g key={"group" + node.nodeID}  >
      <rect className="node" id={node.nodeID} key={'node' + node.nodeID} width={30} height={30}
      fill={color(node.type)} transform={transform}
      //onMouseDown={(event)=>this.props.onMouseDown(event)} 
      //onMouseMove={(event)=>this.props.onMouseMove(event)} 
      //onMouseUp={(event)=>this.props.onMouseUp(event)} 
      onTouchStart={(event) => this.props.onTouchStart(event)}
      onTouchMove={(event) => this.props.onTouchMove(event)}
      onTouchEnd={(event) => this.props.onTouchEnd(event)}
      onTouchCancel={(event) => this.props.onTouchCancel(event)} />
      <text className="NonContentText" key={'label' + node.nodeID} transform={transformLabel} >{node.type}</text>
      </g>
    );
  }
  
  
  
  renderPath = (link) => {
    let d = "M" + (link.x + rectX / 2) + "," + link.data.layer
    + "C" + (link.parent.x + (rectX / 2)) + "," + link.data.layer
    + " " + (link.parent.x + (rectX / 2)) + "," + (link.parent.data.layer + rectY)
    + " " + (link.parent.x + (rectX / 2)) + "," + (link.parent.data.layer + rectY);
    return (
      <path className="link" key={"label" + link.data.name + " to " + link.parent.data.name} stroke={color(1)} d={d} />
    );
  }
  /*
  
  var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });
  
  */
  renderLinks = (link) => {
    let source = _.find(this.props.state.nodes, { "nodeID": link.source });
    let target = _.find(this.props.state.nodes, { "nodeID": link.target });
    let yHeightAdjustment = 30;
    //for arrow placement.
    if(this.props.state.defaultNodeTypes.includes(source.type)){
      yHeightAdjustment = (15 * source.text.length);
    }
    let midx = ((source.x + rectX / 2) + (target.x + rectX / 2))*.50;
    let midy = ((source.y + rectY + yHeightAdjustment) + target.y)*.50;
    let midx2 = (midx + (target.x + rectX / 2))*.50;
    let midy2 = (midy + target.y)*.50;

    return (
      <g key={link.edgeID}>
      <line className="link" stroke={color(1)}
      x1={(source.x + rectX / 2)} y1={(source.y + rectY + yHeightAdjustment)}
      x2={(target.x + rectX / 2)} y2={target.y} />
      <line x1={midx} y1={midy} x2={midx2} y2={midy2} markerEnd={'url(#markerArrow)'} />
      </g>
    );
  }
  
  render() {
    return (
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height}>
      <defs>
      <marker id="markerArrow" viewBox="0 0 10 10" 
      markerUnits="strokeWidth" markerWidth="7" markerHeight="7"
      refX="7"refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
      </defs>
      <rect id="main" width={width} height={height} style={{ fill: 'white', pointerEvents: 'fill', strokeWidth: '0' }}
      //onMouseDown={(event)=>this.props.onMouseDown(event)} 
      //onMouseMove={(event)=>this.props.onMouseMove(event)} 
      //onMouseUp={(event)=>this.props.onMouseUp(event)} 
      
      onTouchStart={(event) => this.props.onTouchStart(event)}
      onTouchMove={(event) => this.props.onTouchMove(event)}
      onTouchEnd={(event) => this.props.onTouchEnd(event)}
      onTouchCancel={(event) => this.props.onTouchCancel(event)} />
      <g>
      {this.props.state.layoutReady && this.props.state.links.map(this.renderLinks)}
      {this.props.state.layoutReady && this.props.state.nodes.map(this.renderNodes)}
    }
    </g>
    {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map(this.props.mainMenu)}
    {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map(this.props.elementMenu)}
    This Browser does not support html canvas.
    </svg>
  );
}

}

export default Layout_Tree;
