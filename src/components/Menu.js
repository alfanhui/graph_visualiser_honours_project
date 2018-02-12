import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuList from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { SET, UPDATE } from 'reducerActions';
import { addToTimer } from 'utilities/Timer';

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
        mainMenuLayer0:[
          {title:"Database", onClick:(uuid) => this.clickDatabase(uuid)},
          {title:"Graph", onClick:(uuid)=> this.clickGraph(uuid)},
          {title:"Options", onClick:(uuid)=> this.clickOptions(uuid)}],
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
          }
        };
      }  
      
      resetTimer = (uuid, type) => {
        this.props.dispatch(addToTimer(uuid, type));
      }
      
      clickBack = (uuid, type) => {
        this.props.dispatch(addToTimer(uuid, type));
        this.setState({layer: 0});
      }
      
      
      //Main menu option click
      clickDatabase = (uuid) =>{
        this.resetTimer(uuid, "mainMenu");
        this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionDatabase(uuid)});
      }
      
      clickGraph = (uuid) =>{
        this.resetTimer(uuid, "mainMenu");
        this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionGraph(uuid)});
      }
      
      clickOptions = (uuid) => {
        this.resetTimer(uuid, "mainMenu");
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionOptions(uuid)});
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
      
      
      //Main menu display option
      displayOptionDatabase = (uuid) =>{
        return(
          <g>
          
          </g>
        );
      }
      
      displayOptionGraph = (uuid) =>{
        return(
          <g>
          
          </g>
        );
      }
      
      displayOptionOptions = (uuid) => {
        return(
          <g>
          
          </g>
        );
      }
      
      //Element menu display option
      displayOptionCreateEdge = (uuid) =>{
        return(
          <g>
          
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
      
      
      renderMainMenu = (menu, transform) =>{
        let pathTransform = "translate(" + (this.state.origin + (this.state.menu_width * .825)) + "," + (this.state.origin +1) +") " + "scale( " + (1* this.props.state.averagedScale) + "," + (1* this.props.state.averagedScale)  + ")";
        return(
          <g transform={transform} key={menu.uuid}>
          {/*<rect x={-(this.state.menu_width/2)} y={-(this.state.menu_height*3.5)} width={this.state.menu_width*1.8} height={this.state.menu_height*8} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"1.0", fill:'red'}}/>*/} {/* stops touches conflicting */}
          <rect x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'mainMenuRect' + menu.x + menu.y} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
          {this.state.layer > 0 ? 
             <g>
             <rect fill='white' width={25*this.props.state.averagedScale} height={25*this.props.state.averagedScale} transform={pathTransform} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
             <path stroke={"black"} d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" transform={pathTransform} style={{fill:"black"}} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
             </g>
            :
            <g/>
          }
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.3)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'mainMenuDetails1' + menu.x + menu.y} >{"Nodes: (" + this.props.state.nodes.length + ")"}</text>
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.6)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'mainMenuDetails2' + menu.x + menu.y} >{"Edges: (" + this.props.state.links.length + ")"}</text>
          {
            this.props.state.updateAvailable
            ?
            <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'mainMenuDetails3' + menu.x + menu.y} stroke="none" fill="red">{"Update Available!"}</text>
            :
            <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className="menuDetails" style={this.state.menuDetailsFontAdjustment} key={'mainMenuDetails3' + menu.x + menu.y} >{"Last updated: " + this.props.state.lastUpdated}</text>
          }
          {this.menuItems(menu)}
          </g>
        );
      }  
      
      renderElementMenu = (menu, transform, node) => {
        let pathTransform = "translate(" + (this.state.origin + (this.state.menu_width * .825)) + "," + (this.state.origin + 1) +") " + "scale( " + (1* this.props.state.averagedScale) + "," + (1* this.props.state.averagedScale)  + ")";
        return (
          <g transform={transform} key={menu.uuid}>
          {/*<rect x={-(this.state.menu_width/2)} y={-(this.state.menu_height*3.5)} width={this.state.menu_width*1.8} height={this.state.menu_height*8} key={'touchborder' + menu.x + menu.y} style={{ fillOpacity:"1.0", fill:'blue'}}*/}/> {/* stops touches conflicting */}
          <rect x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'elementRect' + node.nodeID} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
          {this.state.layer > 0 ? 
            <g>
            <rect fill='white' width={25*this.props.state.averagedScale} height={25*this.props.state.averagedScale} transform={pathTransform} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
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
              <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={this.state.menu_height*3} key={'displayOption' + menu.uuid} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'#FF8A80'}}/>
              {this.state.clickedOption(menu.uuid)}
              </g>
            );        
          }
        }
      }
      
      
      renderMenuItem = (menuObject, index, uuid) => {
        return ( 
          <g key ={'ItemGroup' + index + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'menuRect' + index + "_" + uuid} onClick={() => menuObject.onClick(uuid)}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (index * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'MenuItem' + index + "_" + uuid} >{menuObject.title}</text>
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