import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import { addToTimer, stopTimer } from 'utilities/Timer';
import moment from 'moment';
import Node_Extended from 'utilities/Node_Extended';

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
    //const menu_ratio = 3.666666666666; 
    let averagedScale = this.props.state.averagedScale;
    //to set state correctly.
    let menu_width = 150 * averagedScale, //original 110 x 30 
    menu_height = 40.9 * averagedScale,
    origin = 20;
    let menuItemRectYOrigin = (origin + menu_height);
    this.state = {
      menu_width,
      menu_height,
      origin,
      menuItemRectYOrigin,
      menuItemTextXOrigin: (origin+(menu_width/2)),
      menuItemTextYOrigin: (menuItemRectYOrigin+(menu_height/1.75)),
      layer:0,
      elementMenuLayer0:[
      {title:"Create Edge", onClick:(uuid) => this.clickCreateEdge(uuid)}, 
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
      currentedgeTypeIndex:0, //keep lowercase 'e'
    };
  }   
  
  resetTimer = (uuid, type) => {
    this.props.dispatch(addToTimer(uuid, type));
  }
  
  clickBack = (uuid, type) => {
    this.props.dispatch(addToTimer(uuid, type));
    this.setState({layer: 0});
  }
  
  //element menu option click
  clickCreateEdge = (uuid) =>{
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
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'createEdgeBox' + "_" + uuid} onClick={()=>{this.cycleIndex(uuid, "edgeTypes")}}/>
      <text x={this.state.origin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key={'createEdgeBoxText' + "_" + uuid} >Type:</text>
      <text x={this.state.origin + (this.state.menu_width/2)} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key={'createEdgeBoxTextType' + "_" + uuid} >{this.props.state.edgeTypes[this.state.currentedgeTypeIndex].type}</text>
      
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'CreateEdgeTarget' + "_" + uuid} onClick={()=>{}}/>
      <text x={this.state.origin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key ={'CreateEdgeTargetText' + "_" + uuid}> Target:</text>
      
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'createEdgeButton' + "_" + uuid} onClick={()=>{}}/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'createEdgeButtonText' + "_" + uuid} >Create</text>
      </g>
    );
  }
  
  displayOptionEditNode = (uuid) =>{
    return(
      <g>
      
      </g>
    );
  }
  
  displayOptionDeleteNode = (uuid) => {
    return(
      <g>
      
      </g>
    );
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
  
  renderElementMenu = (menu, transform, node) => {
    
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