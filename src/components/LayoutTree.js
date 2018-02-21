import React from 'react';
import { connect } from "react-redux";
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {scaleHeight} from 'utilities/DataToTree';
import MenuElement from 'components/MenuElement';
import MenuMain from 'components/MenuMain';

let width = window.innerWidth - 40;
let height = window.innerHeight - 40;

const color = d3.scaleOrdinal(d3.schemeCategory20); //range the colours

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class LayoutTree extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    mainMenu: PropTypes.func,
    elementMenu: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchCancel: PropTypes.func,
    loadDatabase: PropTypes.func,
  };
  
  constructor(props) {
    super(props);
    let averagedScale = this.props.state.averagedScale;

    this.state = {
      contextWidth: (150 * averagedScale),
      contextHeight: (10 * averagedScale),
      nonContextWidth: (50 * averagedScale),
      nonContextHeight: (50 * averagedScale),
      layer:0,
      elementMenuLayer0:[{title:"Create Edge", onClick:(uuid) => this.createEdge(uuid)}, 
                          {title:"Edit Node", onClick:this.editNode}, 
                          {title:"Delete Node", onClick:this.deleteNode}],
      mainMenuLayer0:["Database", "Graph", "Options"],
      contextFontAdjustment:{
        fontSize: ((10 * averagedScale) + 'px'),
        lineHeight:((22 * averagedScale) + 'px'),
        minHeight:((22 * averagedScale) + 'px'),
      },
      nonContextFontAdjustment:{
        fontSize:((12 * averagedScale) + 'px'),
        lineHeight:((26 * averagedScale) + 'px'),
        minHeight:((26 * averagedScale) + 'px'),
      },
      creditFontAdjustment:{
        fontSize:((10 * averagedScale) + 'px'),
        lineHeight:((20 * averagedScale) + 'px'),
        minHeight:((20 * averagedScale) + 'px'),
        opacity:0.7
      }
    };
    console.log("Width: " + width + " Height: " + height + " Ratio: " + (width / height)); // eslint-disable-line
    
  }
  
  componentWillMount() {
    
  }
  
  componentDidMount() {
    
  }
  
  componentWillReceiveProps() {
    
  }
  
  componentWillUnmount() {
    
  }
  
  renderNode = (node) => {
    if(this.props.state.defaultNodeTypes.includes(node.type)){
      return this.renderContentNode(node);
    }else{
      return this.renderNonContentNode(node);
    }
  }
  
  //These nodes are the transcript elements: ie. content

  renderContentNode = (node) => {
    if(node.hasOwnProperty("x")){ //this is because DataToTree has not finished ordering
      let transform = 'translate(' + node.x + ',' + node.y + ')';
      let style = {};
      let highlightedNodeUUID = _.find(this.props.state.highlightedNodes, {nodeID:node.nodeID});
      if(highlightedNodeUUID){
        style = {stroke:highlightedNodeUUID.color, strokeWidth:"10px", opacity:1};
      }
      return (
        <g key={"group" + node.nodeID}  >
        <rect className="node" id={node.nodeID} key={'node' + node.nodeID} width={this.state.contextWidth} height={this.state.contextHeight + (node.text.length * (15*this.props.state.averagedScale))}
        fill={color(node.type)} transform={transform}
        style={style}
        onMouseDown={(event)=>this.props.onTouchStart(event, true)} 
        onMouseMove={(event)=>this.props.onTouchMove(event, true)} 
        onMouseUp={(event)=>this.props.onTouchEnd(event, true)} 
        onTouchStart={(event) => this.props.onTouchStart(event, false)}
        onTouchMove={(event) => this.props.onTouchMove(event, false)}
        onTouchEnd={(event) => this.props.onTouchEnd(event, false)}
        onTouchCancel={(event) => this.props.onTouchCancel(event, false)} />
        {
          node.text.map((line, index) => {
            let transformLabel = 'translate(' + (node.x + 5) + ',' + (node.y + (15*this.props.state.averagedScale) + (index * (15*this.props.state.averagedScale))) + ')';
            return(
              <text className="ContentText" style={this.state.contextFontAdjustment} key={'label' + index + node.nodeID} transform={transformLabel} >{line}</text>
            );
          })
        }      
        </g>
      );
    }
  }

  //Non-default are AIF added extended nodes
  renderNonContentNode = (node) => {
    if(node.hasOwnProperty("x")){ //this is because DataToTree has not finished ordering
      let transform = 'translate(' + (node.x - 15 + this.state.contextWidth/2)+ ',' + (node.y + 5) + ') rotate(45 ' +30/2 + ' ' + 30/2 + ')';
      let style = {};
      let highlightedNodeUUID = _.find(this.props.state.highlightedNodes, {nodeID:node.nodeID});
      if(highlightedNodeUUID){
        style = {stroke:highlightedNodeUUID.color, strokeWidth:"10px", opacity:1};
      }
      return (
        <g key={"group" + node.nodeID}  >
        <rect className="node" id={node.nodeID} key={'node' + node.nodeID} width={this.state.nonContextWidth} height={this.state.nonContextHeight}
        fill={color(node.type)} transform={transform}
        style={style}
        onMouseDown={(event)=>this.props.onTouchStart(event, true)} 
        onMouseMove={(event)=>this.props.onTouchMove(event, true)} 
        onMouseUp={(event)=>this.props.onTouchEnd(event, true)} 
        onTouchStart={(event) => this.props.onTouchStart(event, false)}
        onTouchMove={(event) => this.props.onTouchMove(event, false)}
        onTouchEnd={(event) => this.props.onTouchEnd(event, false)}
        onTouchCancel={(event) => this.props.onTouchCancel(event, false)} />
          {
          node.text.map((line, index) => {
            let transformLabel;
            if(node.text.length == 1){
              transformLabel = 'translate(' + (node.x + this.state.contextWidth/2) + ',' + (node.y + (38*this.props.state.averagedScale) + (index * (15*this.props.state.averagedScale))) + ')';
            }else{
              transformLabel = 'translate(' + (node.x + this.state.contextWidth/2) + ',' + (node.y + (28*this.props.state.averagedScale) + (index * (15*this.props.state.averagedScale))) + ')';
            }
            return(
              <text className="NonContentText" style={this.state.nonContextFontAdjustment} key={'label' + index + node.nodeID} transform={transformLabel} >{line}</text>
            );
          })
        }      
        </g>
      );
    }
  }
  
  
  
  renderPath = (link) => {
    let source = _.find(this.props.state.nodes, { "nodeID": link.source });
    let target = _.find(this.props.state.nodes, { "nodeID": link.target });
    if(target && target.hasOwnProperty("x")){ //this is because DataToTree has not finished ordering
      let yHeightAdjustment = (60 * this.props.state.averagedScale);//(nonContextWidth + nonContextHeight / 2);
      //for arrow placement.
      if(this.props.state.defaultNodeTypes.includes(source.type)){
        yHeightAdjustment = ((15*this.props.state.averagedScale) * source.text.length);
      }
      let layerMidHeight = scaleHeight(source.layer + .35) + this.state.contextHeight + yHeightAdjustment;
      if(layerMidHeight < (source.y + this.state.contextHeight + yHeightAdjustment)){ //stops weird line tangle
        layerMidHeight = (source.y + this.state.contextHeight + yHeightAdjustment);
      }
      let d = "M " + (source.x + (this.state.contextWidth / 2)) + " " + (source.y + this.state.contextHeight + yHeightAdjustment)
      + " C " + (source.x + (this.state.contextWidth / 2)) + " " + (layerMidHeight)
      + "  " + (source.x + (this.state.contextWidth / 2)) + " " + (layerMidHeight) //change source.x to target to make correct curve.
      + "  " + (target.x + (this.state.contextWidth / 2)) + " " + (target.y);
      return (
        <path className="link" key={"label" + source.nodeID + " to " + target.nodeID} stroke={color(1)} fill={"none"} d={d} markerEnd={'url(#markerArrow)'} />
      );
    }
  }

  //Deprecated
  renderLink = (link) => {
    let source = _.find(this.props.state.nodes, { "nodeID": link.source });
    let target = _.find(this.props.state.nodes, { "nodeID": link.target });
    let yHeightAdjustment = (30*this.props.state.averagedScale);
    //for arrow placement.
    if(this.props.state.defaultNodeTypes.includes(source.type)){ //if it is a content node.
      yHeightAdjustment = ((15*this.props.state.averagedScale) * source.text.length);
    }
    let midx = ((source.x + this.state.contextWidth / 2) + (target.x + this.state.contextWidth / 2))*.50;
    let midy = ((source.y + this.state.contextHeight + yHeightAdjustment) + target.y)*.50;
    let midx2 = (midx + (target.x + this.state.contextWidth / 2))*.50;
    let midy2 = (midy + target.y)*.50;

    return (
      <g key={link.edgeID}>
      <line className="link" stroke={color(2)}
      x1={(source.x + this.state.contextWidth / 2)} y1={(source.y + this.state.contextHeight + yHeightAdjustment)}
      x2={(target.x + this.state.contextWidth / 2)} y2={target.y} />
      <line x1={midx} y1={midy} x2={midx2} y2={midy2} markerEnd={'url(#markerArrow)'} />
      </g>
    );
  }

  render() {
    return (
      <div>
        { this.props.state.paint &&   <canvas className="paint" id="paint" width={width-5} height={height} /> }
      <svg
      className="svg" id="svg" ref="svg"
      width={width}
      height={height}>
      <defs>
      <marker id="markerArrow" viewBox="0 0 10 10" 
      markerUnits="strokeWidth" markerWidth={7*this.props.state.averagedScale} markerHeight={7*this.props.state.averagedScale}
      refX="7"refY="5" orient="90">
      <path d="M 0 0 L 10 5 L 0 10 z" style={{fill: 'black'}}/>
      </marker>     
      </defs>

      <rect id="main" width={width} height={height} style={{ fill: 'white', pointerEvents: 'fill', strokeWidth: '0' }}
        onMouseDown={(event)=>this.props.onTouchStart(event, true)} 
        onMouseMove={(event)=>this.props.onTouchMove(event, true)} 
        onMouseUp={(event)=>this.props.onTouchEnd(event, true)} 
        onTouchStart={(event) => this.props.onTouchStart(event, false)}
        onTouchMove={(event) => this.props.onTouchMove(event, false)}
        onTouchEnd={(event) => this.props.onTouchEnd(event, false)}
        onTouchCancel={(event) => this.props.onTouchCancel(event, false)} 
        />
      <g>
      {this.props.state.nodes && this.props.state.nodes.length > 0 && this.props.state.nodes.map(this.renderNode)}
      {this.props.state.links &&  this.props.state.links.length > 0 && this.props.state.links.map(this.renderPath)}
    }
    </g>
    {/***** Spinner Code written by Zeeshan Ansari from CodePen  https://codepen.io/zeeshan_ansari/pen/gpwQvw on 22nd of May 2015 */}
    <svg x={width/2} y={height/2} viewBox="0 0 28 28" width="80" height="80">
      <g className="qp-circular-loader">
      {this.props.state.loading && <path className="qp-circular-loader-path" fill="none" d={"M 15 1.5 A 12.5,12.5 0 1 1 1.5,14"} strokeLinecap="round" />}
      </g>
    </svg>
    {/** End of third party Code*/}
    <text x={width*.92} y={height*.98} className="menuItem" style={this.state.creditFontAdjustment}>Stuart Huddy, Computing & Cognitive Science</text> 
    <text x={width*.92} y={height*.995} className="menuItem" style={this.state.creditFontAdjustment}>Honours project, University of Dundee, 2018</text> 
    {this.props.state.mainMenu.length > 0 && this.props.state.mainMenu.map((nextMenu)=> {
       return (
            <MenuMain
            key={"MM" + nextMenu.x + nextMenu.y}
            menu={nextMenu}
            loadDatabase={(dataFile)=>this.props.loadDatabase(dataFile)}
            />
          );
    })}
    {this.props.state.elementMenu.length > 0 && this.props.state.elementMenu.map((nextMenu)=> {
      return (
            <MenuElement
              key={"EM" + nextMenu.x + nextMenu.y}
              menu={nextMenu}
            />
          );
    })}
    This Browser does not support html canvas.
    </svg>
    </div>
  );
}
}

export default LayoutTree;
