import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import { addToTimer, stopTimer } from 'utilities/Timer';
import {wipeDatabase} from 'api/dbConnection';
import moment from 'moment';

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
loadDatabase: PropTypes.func,
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
let currentFileName = this.props.state.currentDataFile;
let currentDataFileIndex = _.findIndex(this.props.state.dataFiles, function(file){return file==currentFileName })
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
    {title:"Create Node", onClick:(uuid)=> this.clickCreateNode(uuid)},
    {title:"About", onClick:(uuid)=> this.clickAbout(uuid)}],
    mainMenuLayer1:[
      {title:"Import", onClick:(uuid) => this.clickImport(uuid)},
      {title:"Auto-Layout", onClick:(uuid)=> this.clickAutoLayout(uuid)},
      {title:"Export", onClick:(uuid)=> this.clickExport(uuid)}],
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
      currentDataFileIndex,
      currentEdgeTypeIndex:0,
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
    this.setState({layer: 2});
  }
  
  clickCreateNode = (uuid) =>{
    this.resetTimer(uuid, "mainMenu");
    this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionCreateNode(uuid)});
  }
  
  clickAbout = (uuid) => {
    this.resetTimer(uuid, "mainMenu");
    this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionAbout(uuid)});
  }
  
  //Main menu option click
  clickImport = (uuid) =>{
    this.resetTimer(uuid, "mainMenu");
    this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionImport(uuid)});
  }
  
  clickAutoLayout = (uuid) =>{
    this.resetTimer(uuid, "mainMenu");
    this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionAutoLayout(uuid)});
  }
  
  clickExport = (uuid) => {
    this.resetTimer(uuid, "mainMenu");
    this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionExport(uuid)});
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
  
  displayOptionCreateNode = (uuid) =>{
    return(
      <g>
      
      </g>
    );
  }
  
  displayOptionAbout = (uuid) => {
    return(
      <g>
      
      </g>
    );
  }
  
  cycleDatafiles(uuid){
    this.resetTimer(uuid, "mainMenu");
    if((this.props.state.dataFiles.length-1) == this.state.currentDataFileIndex){
      this.setState({currentDataFileIndex:0});
    }else{
      this.setState({currentDataFileIndex:( this.state.currentDataFileIndex + 1)});
    }
  }
  
  importDatabase(){
    if(this.props.state.dataFiles[this.state.currentDataFileIndex] == "CLEAR"){
      this.props.dispatch(wipeDatabase());
    }else{
      this.props.loadDatabase(this.props.state.dataFiles[this.state.currentDataFileIndex]);
    }
  }
  
  displayOptionImport = (uuid) =>{
    return(
      <g key ={'import' + "_" + uuid}>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height * 2)} className="menuItemRect" key={'importOptionBox' + "_" + uuid} fill="white" onClick={()=>{this.cycleDatafiles(uuid)}}/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'importInfo' + "_" + uuid} >[Tap to Choose]</text>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'importFileName' + "_" + uuid} >{("nodeset " + this.props.state.dataFiles[this.state.currentDataFileIndex])}</text>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'importButton' + "_" + uuid} fill="white" onClick={()=>{this.importDatabase()}}/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'importButtonText' + "_" + uuid} >IMPORT</text>
      </g>
    );
  }
  
  displayOptionAutoLayout = (uuid) =>{
    if(this.props.state.creationHaltRefresh){
      return( //tell user this is not possible because someone is creating a node.
        <g>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height * 3)} className="menuItemRect" key={'AutoLayoutOptionBox' + "_" + uuid} fill="white"/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText0' + "_" + uuid} >Unable to Refresh</text>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText1' + "_" + uuid} >Another user is</text>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText2' + "_" + uuid} >creating elements</text>
        </g>
      );
    }else{ //show refresh button
      return(
        <g>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height * 2)} className="menuItemRect" key={'AutoLayoutOptionBox0' + "_" + uuid} fill="white"/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText0' + "_" + uuid} >Auto-Layout</text>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText1' + "_" + uuid} >will refresh page</text>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'AutoLayoutOptionBox1' + "_" + uuid} fill="white" onClick={()=>{this.props.dispatch(stopTimer(uuid, "mainMenu")), this.props.loadDatabase(null)}}/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'AutoLayoutOptionText2' + "_" + uuid}> OK </text>
        </g>
      );
    }
  }
  
  
  
  displayOptionExport = (uuid) => {
    return( //tell user this is not possible because someone is creating a node.
      <g>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'ExportOptionBox0' + "_" + uuid} fill="white"/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'ExportOptionText0' + "_" + uuid} >Export as:</text>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'ExportOptionBox1' + "_" + uuid} fill="white" onClick={()=>{this.svgToPNG()}}/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'ExportOptionText1' + "_" + uuid} >.PNG</text>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'ExportOptionBox2' + "_" + uuid} fill="white" onClick={()=>{this.svgToJSON()}}/>
      <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className="menuItem" style={this.state.menuItemFontAdjustment} key ={'ExportOptionText2' + "_" + uuid}>.JSON</text>
      </g>
    );
  }
  
  /*
  * This Code was written by Chris Viau’s on Bl.ock.org, block id: 8187844
  * 6th of August, 2017
  * http://bl.ocks.org/biovisualize/8187844
  */
  svgToPNG(){
    let svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
    canvas.width = window.innerWidth -40;
    canvas.height = window.innerHeight -40;
    let ctx = canvas.getContext("2d");
    let DOMURL = self.URL || self.webkitURL || self;
    let img = new Image();
    let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    let url = DOMURL.createObjectURL(svg);
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      let png = canvas.toDataURL("image/png");
      let imgURI = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
      /*
      * Code was written by worstenbrood from StackOverflow
      */
        let evt = new MouseEvent("click", {
          view: window,
          bubbles: false,
          cancelable: true
        });
        let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
        let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("YYYYMMDD");
        let a = document.createElement("a");
        a.setAttribute("download", date + "_GV_screenshot.png");
        a.setAttribute("href", imgURI);
        a.setAttribute("target", '_blank');
        a.dispatchEvent(evt);
      /**** End of Code written by worstenbrood **** */
    };
    img.src = url;
  }
  
  svgToJSON(){
    let nodes = _.cloneDeep(this.props.state.nodes);
    nodes.map((node) =>{
      node.text = node.text.join(" ");
    });
    let jsonObject = {nodes, edges:this.props.state.links};
    let str = JSON.stringify(jsonObject);
    let jsonUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    /*
     * Code was written by worstenbrood from StackOverflow
     */
    let evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true
    });
    let timestamp = moment().format("YYYY-MM-DD HH:MM:SS");
    let date = moment(timestamp, "YYYY-MM-DD HH:MM:SS").format("YYYYMMDD");
    let a = document.createElement("a");
    a.setAttribute("download", date + "_GV.json");
    a.setAttribute("href", jsonUri);
    a.setAttribute("target", '_blank');
    a.dispatchEvent(evt);
    /**** End of Code written by worstenbrood **** */ 
  }

  
  cycleExtendedNodeTypes(uuid){
    this.resetTimer(uuid, "elementMenu");
    if((this.props.state.edgeTypes.length-1) == this.state.currentEdgeTypeIndex){
      this.setState({currentEdgeTypeIndex:0});
    }else{
      this.setState({currentEdgeTypeIndex:( this.state.currentEdgeTypeIndex + 1)});
    }
  }
  
  //Element menu display option
  displayOptionCreateEdge = (uuid) =>{
    return(
      <g key ={'createEdge' + "_" + uuid}>
      <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'createEdgeBox' + "_" + uuid} onClick={()=>{this.cycleExtendedNodeTypes(uuid)}}/>
      <text x={this.state.origin} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuCreateEdgeFontAdjustment} key={'createEdgeBoxText' + "_" + uuid} >Type:</text>
      <text x={this.state.origin*4} y={this.state.menuItemTextYOrigin} className="menuItem" style={this.state.menuItemFontAdjustment} key={'createEdgeBoxTextType' + "_" + uuid} >{this.props.state.edgeTypes[this.state.currentEdgeTypeIndex].name}</text>
      
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
  
  
  renderMainMenu = (menu, transform) =>{
    let pathTransform = "translate(" + (this.state.origin + (this.state.menu_width * .825)) + "," + (this.state.origin +1) +") " + "scale( " + (1* this.props.state.averagedScale) + "," + (1* this.props.state.averagedScale)  + ")";
    return(
      <g transform={transform} key={menu.uuid}>
      {/*<rect x={-(this.state.menu_width/2)} y={-(this.state.menu_height*3.5)} width={this.state.menu_width*1.8} height={this.state.menu_height*8} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"1.0", fill:'red'}}/>*/} {/* stops touches conflicting */}
      <rect x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'mainMenuRect' + menu.x + menu.y} fill="white" onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
      {this.state.layer > 0 ? 
        <g>
        <rect fill='white' width={25*this.props.state.averagedScale} height={25*this.props.state.averagedScale} transform={pathTransform} fill={"white"} onClick={()=>this.clickBack(menu.uuid, menu.type)}/>
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
      <rect fill="white" x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'elementRect' + node.nodeID} onClick={()=>this.resetTimer(menu.uuid, menu.type)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
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
    if(menu.type == "mainMenu"){
      return this.renderMainMenu(menu, transform);
    }else{
      let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
      return this.renderElementMenu(menu, transform, node);
    }
  }
  
}

export default Menu;