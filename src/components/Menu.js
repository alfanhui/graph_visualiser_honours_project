import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuList from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { SET, UPDATE } from 'reducerActions';
import { addToTimer } from 'utilities/Timer';

let origin = 20;
let menuItemRectOrigin = origin+40,
menuItemTextXOrigin = menuItemRectOrigin + 15,
menuItemTextYOrigin = menuItemRectOrigin + 20;

let menu_width = 110,
    menu_height = 30;

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
    this.state = {
      layer:0,
      elementMenuLayer0:[
        {title:"Create Edge", onClick:(uuid) => this.createEdge(uuid)}, 
        {title:"Edit Node", onClick:(uuid) => this.editNode(uuid)}, 
        {title:"Delete Node", onClick:(uuid) => this.deleteNode(uuid)}],
      mainMenuLayer0:[
        {title:"Database", onClick:(uuid)=> this.clickDatabase(uuid)},
        {title:"Graph", onClick:(uuid)=> this.clickDatabase(uuid)},
        {title:"Options", onClick:(uuid)=> this.clickDatabase(uuid)}],
    };
  }  
  
  resetTimer = (uuid, type) => {
    this.props.dispatch(addToTimer(uuid, type));
  }
  
  createEdge = (uuid) =>{
    this.resetTimer(uuid, "elementMenu");
  }
  
  editNode = (uuid) =>{
    this.resetTimer(uuid, "elementMenu");
  }
  
  deleteNode = (uuid) => {
    this.resetTimer(uuid, "elementMenu");
  }
  
  
  
  renderMainMenu = (menu, transform) =>{
    return(
      <g transform={transform} key={menu.uuid}>
      <rect x={-50} y={-100} width={200} height={250} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"0.0"}}/> {/* stops touches conflicting */}
      <rect x={origin} y={origin} width={110} height={40} key={'mainMenuRect' + menu.x + menu.y} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
      <text x={origin + 5} y={origin+ 10} className="ContentText" key={'mainMenuDetails1' + menu.x + menu.y} >{"Nodes: (" + this.props.state.nodes.length + ")"}</text>
      <text x={origin + 5} y={origin + 23} className="ContentText" key={'mainMenuDetails2' + menu.x + menu.y} >{"Edges: (" + this.props.state.links.length + ")"}</text>
      {
        this.props.state.updateAvailable
        ?
        <text x={origin + 5} y={origin + 36} className="ContentText" key={'mainMenuDetails3' + menu.x + menu.y} stroke="none" fill="red">{"Update Available!"}</text>
        :
        <text x={origin + 5} y={origin + 36} className="ContentText" key={'mainMenuDetails3' + menu.x + menu.y} >{"Last updated: " + this.props.state.lastUpdated}</text>
      }
      {this.mainMenuItems(menu.uuid)}
      </g>
    );
  }  

  mainMenuItems = (uuid) =>{
    switch(this.state.layer){
      case 0:{
        return (this.state.mainMenuLayer0.map((title, index) => {
          return this.renderMenuItem(title, index, uuid);
        }));
      }
    }
  }
  
  renderElementMenu = (menu, transform, node) => {
    return (
      <g transform={transform} key={menu.uuid}>
      <rect x={-50} y={-100} width={200} height={250} key={'touchborder' + menu.x + menu.y} style={{ fillOpacity:"0.0"}}/> {/* stops touches conflicting */}
      <rect x={origin} y={origin} width={110} height={40} key={'elementRect' + node.nodeID} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
      <text x={origin + 20} y={origin+ 10} className="ContentText" key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
      <text x={origin + 5} y={origin + 23} className="ContentText" key={'elementDetails2' + node.nodeID} >{"DATE: " + node.date}</text>
      <text x={origin + 5} y={origin + 36} className="ContentText" key={'elementDetails3' + node.nodeID} >{"TIME: " + node.time}</text>
      {this.menuItems(menu.uuid)}
      </g>
    );
  }
  
  menuItems = (uuid) =>{
    switch(this.state.layer){
      case 0:{
        return (this.state.elementMenuLayer0.map((title, index) => {
          return this.renderMenuItem(title, index, uuid);
        }));
      }
    }
  }
  
  
  renderMenuItem = (menuObject, index, uuid) => {
    return (
      <g key ={'ItemGroup' + index + "_" + uuid}>
      <rect x={origin} y={menuItemRectOrigin + (index * 30)} width={menu_width} height={menu_height} className="menuItemRect" key={'menuRect' + index + "_" + uuid} onClick={() => menuObject.onClick(uuid)}/>
      <text x={menuItemTextXOrigin} y={menuItemTextYOrigin + (index * 30)} className="menuItem" key ={'MenuItem' + index + "_" + uuid} >{menuObject.title}</text>
      </g>
    );
  }
  
  
  render() {
    let menu = this.props.menu;
    let transform = "translate(" + (menu.x - 40) + "," + (menu.y - 40) + ")"; //minus margins
    if(menu.type == "mainMenu"){
      return this.renderMainMenu(menu, transform);
    }else{
      let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
      return this.renderElementMenu(menu, transform, node);
    }
  }
  
}

export default Menu;