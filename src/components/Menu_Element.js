import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import { SET, UPDATE, DROP } from 'reducerActions';
import { addToTimer, stopTimer } from 'utilities/Timer';
import moment from 'moment';
import {makeEdge} from 'utilities/Edge';

const color = d3.scaleOrdinal(d3.schemeCategory20); 

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class Menu extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    menu: PropTypes.object,
  };
  
  constructor(props) {
    super(props);
    let averagedScale = this.props.state.averagedScale;
    //to set state correctly.
    let menu_width = 150 * averagedScale,
    menu_height = 40.9 * averagedScale,
    origin = 20;
    let menuItemRectYOrigin = (origin + menu_height);
    
    //order Targetable nodes by closest
    let distancesToTarget = this.distancesToTarget(this.props);
    
    this.state = {
      menu_width,
      menu_height,
      origin,
      menuItemRectYOrigin,
      menuItemTextXOrigin: (origin+(menu_width/2)),
      menuItemTextYOrigin: (menuItemRectYOrigin+(menu_height/1.75)),
      layer:0,
      elementMenuLayer0:[
        {title:"Create Edge", onClick:(uuid) => this.state.distancesToTarget.length > 1 && this.clickCreateEdge(uuid)}, 
        {title:"Edit Node", onClick:(uuid) => this.clickEditNode(uuid)}, 
        {title:"Delete Node", onClick:(uuid) => this.clickDeleteNode(uuid)}],
        clickedOption: ()=>{},
        menuDetailsFontAdjustment:{
          fontSize: ((12 * averagedScale) + 'px'),
          lineHeight:((26 * averagedScale) + 'px'),
          minHeight:((26 * averagedScale) + 'px'),
        },
        menuItemFontAdjustment:{
          fontSize:((18 * averagedScale) + 'px'),
          lineHeight:((36 * averagedScale) + 'px'),
          minHeight:((36 * averagedScale) + 'px'),
        }, 
        menuCreateEdgeFontAdjustment:{
          textAnchor:'inherit',
          fontSize:((18 * averagedScale) + 'px'),
          lineHeight:((36 * averagedScale) + 'px'),
          minHeight:((36 * averagedScale) + 'px'),
          
        }, 
        colourTag:this.getRandomColor(),
        nodeTypesCurrentIndex:0,
        nodeTargetCurrentIndex:1,
        distancesToTarget,
      };
    }  
    
    componentWillUnmount(){
      let menu = this.props.menu;
      this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
    }

          /* Code written by Anatoliy from Stackoverflow on 27th Sep 2009 at 21:25
      * https://stackoverflow.com/questions/1484506/random-color-generator
      */
     getRandomColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
    
    distancesToTarget(props){
      let nodes = _.cloneDeep(props.state.nodes);
      let menu = props.menu;
      let current_node = _.find(props.state.nodes, { "nodeID": menu.nodeID });
      let distanceArray = nodes.map((target_node, index)=> {
        return({ targetNode:target_node.nodeID,
          index,
          invalid_layer:target_node.layer < current_node.layer ? true : false,
          distance: Math.pow(
            Math.pow((target_node.x - current_node.x), 2) 
            + 
            Math.pow((target_node.y - current_node.y), 2)
            , .5)}
          );
        }); 
        //distanceArray = distanceArray.filter(item => !item.invalid_layer);
        distanceArray = _.orderBy(distanceArray, ['distance'],['asc']);
        return distanceArray;
      }
      
      resetTimer = (uuid, type) => {
        this.props.dispatch(addToTimer(uuid, type));
      }
      
      clickBack = (uuid, type) => {
        let menu = this.props.menu;
        this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
        this.props.dispatch(addToTimer(uuid, type));
        this.setState({layer: 0});
      }
      
      //element menu option click
      clickCreateEdge = (uuid) =>{
        this.props.dispatch(UPDATE("highlightedNodes", {nodeID:this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode, color:this.state.colourTag}));
        this.resetTimer(uuid, "elementMenu");
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionCreateEdge(uuid)});
      }
      
      clickEditNode = (uuid) =>{
        this.resetTimer(uuid, "elementMenu");
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionEditNode(uuid)});
      }
      
      clickDeleteNode = (uuid) => {
        this.resetTimer(uuid, "elementMenu");
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionDeleteNode(uuid)});
      }
      
      //Element menu display option
      displayOptionCreateEdge = (uuid) =>{
        return(
          <g key ={'createEdge' + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'createEdgeBox' + "_" + uuid}/>
          <text x={this.state.origin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key={'createEdgeBoxText' + "_" + uuid} >Tap to Choose</text>
          
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'CreateEdgeTarget' + "_" + uuid} onClick={()=>{this.cycleDistanceIndex(uuid)}}/>
          <text x={this.state.origin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key ={'CreateEdgeTargetText' + "_" + uuid}> Target:</text>
          <text x={this.state.origin + (this.state.menu_width*.75)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" 
          style={{fontSize:((18 * this.props.state.averagedScale) + 'px'), 
          lineHeight:((36 * this.props.state.averagedScale) + 'px'),
          minHeight:((36 * this.props.state.averagedScale) + 'px'),
          stroke:this.state.colourTag,
          strokeWidth:"2" }} 
          key={'createEdgeBoxTarget' + "_" + uuid}> {this.state.distancesToTarget.length > 1 && this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode}</text>
          
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'createEdgeButton' + "_" + uuid} onClick={()=>{this.createEdge(uuid)}}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'createEdgeButtonText' + "_" + uuid} >Create</text>
          </g>
        );
      }
      
      displayOptionEditNode = (uuid) =>{
        let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
        return(
          <g key ={'editEdge' + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'editEdgeBox' + "_" + uuid}/>
          <text x={this.state.origin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key={'editEdgeBoxText' + "_" + uuid} >Current Type: </text>
          <text x={this.state.origin + (this.state.menu_width*.75)} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key={'editEdgeBoxText' + "_" + uuid} >{node.type}</text>

          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'editEdgeTarget' + "_" + uuid} onClick={()=>{this.cycleIndex(uuid,"nodeTypes")}}/>
          <text x={this.state.origin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key ={'editEdgeTargetText' + "_" + uuid}>New Type:</text>
          <text x={this.state.origin + (this.state.menu_width*.5)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" key={'editEdgeBoxTarget' + "_" + uuid}>{this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type}</text>
          
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'editEdgeButton' + "_" + uuid} onClick={()=>{this.editNode(uuid)}}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'editEdgeButtonText' + "_" + uuid} >Ammend</text>
          </g>
        );
      }
      
      displayOptionDeleteNode = (uuid) => {
        return(
          <g>
          
          </g>
        );
      }
      
      createEdge(uuid){
        let menu = this.props.menu;
        let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
        let newEdge = makeEdge(node, {nodeID:this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode});
        this.props.dispatch(UPDATE("links", newEdge)); //update local nodes
        this.props.dispatch(stopTimer(uuid, "elementMenu")); //remove menu
        if(this.props.state.updateFromCreate){
          this.props.dispatch(importEdge(newEdges)); //import edges into neo4j
        }
      }

      editNode(uuid){
        let menu = this.props.menu;
        let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
        this.props.dispatch(DROP("nodes", node)); //update local nodes
        node.type = 
        this.props.dispatch(UPDATE("nodes", node)); //update local nodes
        this.props.dispatch(stopTimer(uuid, "elementMenu")); //remove menu
        if(this.props.state.updateFromCreate){
          this.props.dispatch(updateNode(newNode)); //import edges into neo4j
        }
      }

      deleteNode(uuid){
        let menu = this.props.menu;
        let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
        this.props.dispatch(DROP("nodes", node)); //update local nodes
        this.props.dispatch(stopTimer(uuid, "elementMenu")); //remove menu
        if(this.props.state.updateFromCreate){
          this.props.dispatch(importEdge(newEdges)); //import edges into neo4j
        }
      }
    
      
      cycleDistanceIndex(uuid){
        this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
        let index = 1;
        this.resetTimer(uuid, "elementMenu");
        if((this.state.distancesToTarget.length-1) != this.state.nodeTargetCurrentIndex){
          index = this.state.nodeTargetCurrentIndex + 1;
        }
        this.setState({nodeTargetCurrentIndex:index});
        this.props.dispatch(UPDATE("highlightedNodes", {nodeID:this.state.distancesToTarget[index].targetNode, color:this.state.colourTag}));
      }
      
      cycleIndex(uuid, type){
        this.resetTimer(uuid, "elementMenu");
        let variable = type + "CurrentIndex";
        if((this.props.state[type].length-1) == this.state[variable]){
          this.setState({[variable]:0});
        }else{
          this.setState({[variable]:( this.state[variable] + 1)});
        }
      }
      
      menuItems = (menu) =>{
        switch(this.state.layer){
          case 0:{
            return (this.state[menu.type + "Layer0"].map((title, index) => {
              return this.renderMenuItem(title, index, menu.uuid);
            }));
          }
          case 1:{
            return( 
              <g>
              <rect fill="white" x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={this.state.menu_height*3} key={'displayOption' + menu.uuid} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'#FF8A80'}}/>
              {this.state.clickedOption(menu.uuid)}
              </g>
            );        
          }
          case 2:{
            return (this.state[menu.type + "Layer1"].map((title, index) => {
              return this.renderMenuItem(title, index, menu.uuid);
            }));
          }
        }
      }
      
      
      renderMenuItem = (menuObject, index, uuid) => {
        return ( 
          <g key ={'ItemGroup' + index + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'menuRect' + index + "_" + uuid} fill="white" onClick={() => menuObject.onClick(uuid)}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (index * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'MenuItem' + index + "_" + uuid} >{menuObject.title}</text>
          </g>
        );
      }
      
      
      render() {
        let menu = this.props.menu;
        let transform = "translate(" + (menu.x - 40) + "," + (menu.y - 40) + ")"; //minus margins
        let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
        let pathTransform = "translate(" + (this.state.origin + (this.state.menu_width * .825)) + "," + (this.state.origin + 1) +") " + "scale( " + (1* this.props.state.averagedScale) + "," + (1* this.props.state.averagedScale)  + ")";
        return (
          <g transform={transform} key={menu.uuid}>
          {/*<rect x={-(this.state.menu_width/2)} y={-(this.state.menu_height*3.5)} width={this.state.menu_width*1.8} height={this.state.menu_height*8} key={'touchborder' + menu.x + menu.y} style={{ fillOpacity:"1.0", fill:'blue'}}*/}/> {/* stops touches conflicting */}
          <rect fill="white" x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'elementRect' + node.nodeID} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
          {this.state.layer > 0 ? 
            <g>
            <rect fill='white' width={25} height={25} transform={pathTransform} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
            <path stroke={"black"} d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" transform={pathTransform} style={{fill:"black"}} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
            </g>
            :
            <g/>
          }
          <text x={this.state.origin*2} y={this.state.origin + (this.state.menu_height *.3)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.6)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'elementDetails2' + node.nodeID} >{"Date: " + node.date}</text>
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'elementDetails3' + node.nodeID} >{"Time: " + node.time}</text>
          {this.menuItems(menu)}
          </g>
        );
      }
      
    }
    
    export default Menu;