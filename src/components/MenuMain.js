import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import { addToTimer, stopTimer } from 'utilities/Timer';
import {wipeDatabase} from 'utilities/DBConnection';
import moment from 'moment';
import Node from 'utilities/Node';
import {importNode} from 'utilities/CypherIO';
import classnames from 'classnames';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class MenuMain extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    menu: PropTypes.object,
    loadDatabase: PropTypes.func
  };
  
  constructor(props) {
    super(props);
    let averagedScale = this.props.state.averagedScale;
    //to set state correctly.
    let menu_width = 150 * averagedScale, //original 110 x 30 
    menu_height = 40.9 * averagedScale,
    origin = 20;
    let menuItemRectYOrigin = (origin + menu_height);
    let currentFileName = this.props.state.currentDataFile;
    let dataFilesCurrentIndex = _.findIndex(this.props.state.dataFiles, function(file){return(file==currentFileName); });
    this.state = {
      menu_width,
      menu_height,
      origin,
      menuItemRectYOrigin,
      menuItemTextXOrigin: (origin+(menu_width/2)),
      menuItemTextYOrigin: (menuItemRectYOrigin+(menu_height/1.75)),
      layer:0,
      menuMainArrayLayer0:[
        {title1_part1:"Import", title1_part2:"DATABASE", onClick:(uuid) => this.clickImport(uuid), title2_part1:"Auto", title2_part2:"LAYOUT", onClick2:(uuid) => this.clickAutoLayout(uuid)},
        {title:"Create Node", onClick:(uuid)=> this.clickCreateNode(uuid)},
        {title:"Options", onClick:(uuid)=> this.clickOptions(uuid)}],
          clickedOption: ()=>{},
          dataFilesCurrentIndex,
          nodeTypesCurrentIndex:0,
        };
      }   
      
      cancelTimer = (uuid) => {
        this.props.dispatch(stopTimer(uuid, "menuMainArray"));
      }

      resetTimer = (uuid) => {
        this.props.dispatch(addToTimer(uuid, "menuMainArray"));
      }
      
      clickBack = (uuid) => {
        this.props.dispatch(addToTimer(uuid, "menuMainArray"));
        this.setState({layer: 0});
      }
      
      clickCreateNode = (uuid) =>{
        this.resetTimer(uuid);
        this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionCreateNode(uuid)});
      }
      
      clickOptions = (uuid) => {
        this.resetTimer(uuid);
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptions(uuid)});
      }
      
      //Main menu option click
      clickImport = (uuid) =>{
        this.resetTimer(uuid);
        this.setState({layer: 1, clickedOption:(uuid) => this.displayOptionImport(uuid)});
      }
      
      clickAutoLayout = (uuid) =>{
          this.resetTimer(uuid);
          this.props.state.creationHaltRefresh ? 
              this.setState({ layer: 1, clickedOption: (uuid) => this.displayOptionAutoLayout(uuid)})
              :
              this.autoRefresh(uuid);
      }

      autoRefresh = (uuid) => {
          this.props.dispatch(stopTimer(uuid, "menuMainArray"));
          this.props.loadDatabase(null);
      }
      
      clickExport = (uuid) => {
        this.resetTimer(uuid);
        this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionExport(uuid)});
      }
      
      importDatabase(){
        this.props.dispatch(stopTimer(this.props.menu.uuid, "menuMainArray"));
        if(this.props.state.dataFiles[this.state.dataFilesCurrentIndex] == "CLEAR"){
          this.props.dispatch(wipeDatabase());
        }else{
          this.props.loadDatabase(this.props.state.dataFiles[this.state.dataFilesCurrentIndex]);
        }
      }
      
      
      displayOptionCreateNode = (uuid) =>{
        return(
          <g key ={'createNode' + "_" + uuid}>
          {this.displayCycle(uuid, (uuid, bool, type)=>{this.cycleIndex(uuid, bool, type);}, "nodeTypes")}
          {
            this.props.state.defaultNodeTypes.includes(this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type) ? 
            <g>
            <text x={this.state.origin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18_E")} key ={'CreateNodeTargetText' + "_" + uuid}> Text:</text>
            <foreignObject key={"FO_Div" + uuid} x={this.state.menu_width/2.4} y={this.state.menuItemTextYOrigin + (0.5 * this.state.menu_height)} width={(this.state.menu_width / 2)} height={this.state.menu_height}>
            <div key={"inputDiv" + uuid}xmlns="http://www.w3.org/1999/xhtml">
              <textarea key={"inputInput" + uuid} id={"inputInput" + uuid} onInput={() => this.resetTimer(uuid)}name="text" rows="14" cols="10" wrap="soft" maxLength="120" placeholder="default text" style={{ width: (this.state.menu_width / 1.6) + "px", height: ((this.state.menu_height * .7) + "px"), fontSize: ((22 * this.props.state.averagedScale) + "px"), overflow: "hidden", resize: "none" }}/>
            </div>
            </foreignObject>
            </g>
            :
            <text x={this.state.origin + (this.state.menu_width/2)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'CreateNodeTargetText' + "_" + uuid}>{this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].name}</text>
          }
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'createNodeButton' + "_" + uuid} onClick={()=>{this.createNode(uuid);}}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'createNodeButtonText' + "_" + uuid} >Create</text>
          </g>
        );
      }
      
      displayOptions = (uuid) => {
        return(
          <g key ={'options' + "_" + uuid}>
          {/*first row*/}
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height * 3)} className="menuItemRect" key={'AboutBox' + "_" + uuid} fill="white"/>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutAutoUpdateBox' + "_" + uuid} fill="white" onClick={()=>{this.toggleProp(uuid, "updateAuto");}}/>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height * .25)} className={classnames("menuItem", "fontAdjustment10")}  key ={'AboutAutoUpdate1' + "_" + uuid}>Auto-Update</text>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25)} className={classnames("menuItem", "fontAdjustment18")} key ={'AboutAutoUpdate2' + "_" + uuid}>{this.props.state.updateAuto ? "ON" : "OFF"}</text>
          <rect x={this.state.origin + this.state.menu_width/2} y={this.state.menuItemRectYOrigin} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutUpdateCreateBox' + "_" + uuid} fill="white" onClick={()=>{this.toggleProp(uuid, "updateFromCreate");}}/>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height *.25)} className={classnames("menuItem", "fontAdjustment10")}  key ={'AboutUpdateCreate1' + "_" + uuid} >Update-Changes</text>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25)} className={classnames("menuItem", "fontAdjustment18")} key ={'AboutUpdateCreate2' + "_" + uuid} >{this.props.state.updateFromCreate ? "ON" : "OFF"}</text>
          {/*second row*/}
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutPaintBox' + "_" + uuid} fill="white" onClick={()=>{this.toggleProp(uuid, "paint");}}/>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height * .25) + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment10")}  key ={'AboutPaint1' + "_" + uuid}>Paint</text>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'AboutPaint2' + "_" + uuid}>{this.props.state.paint ? "ON" : "OFF"}</text>
          <rect x={this.state.origin + this.state.menu_width/2} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutDatabaseBox' + "_" + uuid} fill="white"/>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height *.25) + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment10")} key ={'AboutDatabase1' + "_" + uuid} >DATABASE</text>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} style={{fill:(this.props.state.databaseError == "#FFFFF" ? 'green' : this.props.state.databaseError )}} key ={'AboutDatabase2' + "_" + uuid} >{this.props.state.databaseError == "#FFFFF" ? "OK!" : "BAD"}</text>
          {/*third row*/}
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutAutoExportPNGBox' + "_" + uuid} fill="white" onClick={()=>{this.svgToPNG();}}/>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height * .25) + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment10")}  key ={'AboutExportPNG1' + "_" + uuid}>Export</text>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'AboutExportPNG2' + "_" + uuid}>.PNG</text>
          <rect x={this.state.origin + this.state.menu_width/2} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'AboutExportJSONBox' + "_" + uuid} fill="white" onClick={()=>{this.svgToJSON();}}/>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height *.25) + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment10")}  key ={'AboutExportJSON1' + "_" + uuid} >Export</text>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'AboutExportJSON2' + "_" + uuid} >.JSON</text>       
        </g>
      );
    }
    
    displayOptionImport = (uuid) =>{
      return(
        <g key ={'import' + "_" + uuid}>
        {this.displayCycle(uuid, (uuid, bool, type)=>{this.cycleIndex(uuid, bool, type);}, "dataFiles")}
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key={'importFileName' + "_" + uuid} >
                  {this.props.state.dataFiles[this.state.dataFilesCurrentIndex] == "CLEAR" ? "Clear Screen" : ("nodeset " + this.props.state.dataFiles[this.state.dataFilesCurrentIndex])}
        </text>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'importButton' + "_" + uuid} fill="white" onClick={()=>{this.importDatabase();}}/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'importButtonText' + "_" + uuid} >IMPORT</text>
        </g>
      );
    }
    
    displayOptionAutoLayout = (uuid) => {
     return( //tell user this is not possible because someone is creating a node.
          <g>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height * 3)} className="menuItemRect" key={'AutoLayoutOptionBox' + "_" + uuid} fill="white"/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18")} key ={'AutoLayoutOptionText0' + "_" + uuid} >Unable to Refresh.</text>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")}  key ={'AutoLayoutOptionText1' + "_" + uuid} >An Element Menu</text>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")}  key ={'AutoLayoutOptionText2' + "_" + uuid} >is in use</text>
          </g>
        );
  
    }
    
    
    displayOptionExport = (uuid) => {
      return( //tell user this is not possible because someone is creating a node.
        <g>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'ExportOptionBox0' + "_" + uuid} fill="white"/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18")}  key ={'ExportOptionText0' + "_" + uuid} >Export as:</text>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'ExportOptionBox1' + "_" + uuid} fill="white" onClick={()=>{this.svgToPNG();}}/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'ExportOptionText1' + "_" + uuid} >.PNG</text>
        <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'ExportOptionBox2' + "_" + uuid} fill="white" onClick={()=>{this.svgToJSON();}}/>
        <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'ExportOptionText2' + "_" + uuid}>.JSON</text>
        </g>
      );
    }

    displayCycle = (uuid, clickFunction, type) =>{
      return(
        <g>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width/2} height={(this.state.menu_height * 2)} className="menuItemRectLR" key={'createEdgeBoxLeft' + "_" + uuid} onClick={() => { clickFunction(uuid, false, type);}}/>
          <rect x={this.state.origin+this.state.menu_width/2} y={this.state.menuItemRectYOrigin} width={this.state.menu_width/2} height={(this.state.menu_height * 2)} className="menuItemRectLR" key={'createEdgeBoxRight' + "_" + uuid} onClick={() => { clickFunction(uuid, true, type);}}/>
          <text x={this.state.origin+this.state.menu_width*.3} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment17")} key={'createEdgeBoxText1' + "_" + uuid} >{"<Previous"}</text>
          <text x={this.state.origin+this.state.menu_width*.8} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment17")} key={'createEdgeBoxText2' + "_" + uuid} >{"Next>"}</text>
        </g>
      );
    }
    
    createNode(uuid){
      let menu = this.props.menu;
      let text;
      let isContent = this.props.state.defaultNodeTypes.includes(this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type);
      if(isContent){
        let inputObject = document.getElementById("inputInput" + uuid);
        let now = Date.now();
        let hours = new Date(now).getHours(),
        minutes = new Date(now).getMinutes(),
        seconds = new Date(now).getSeconds();
        if (minutes < 10){
          minutes = "0" + minutes;
        }
        if(seconds < 10){
          seconds = "0" + seconds;
        }
        text = inputObject && inputObject.value !="" ? inputObject.value : "NODE_" + hours + minutes + seconds;
      } else{
        text = this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].name;
      }
      let nodeData = {type:this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type, 
        text, 
        scheme:this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].schema, 
        schemaID:this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].schemeID};
        let newNode = new Node(menu, nodeData, isContent);
        this.props.dispatch(UPDATE("nodes", newNode)); //update local nodes
        this.props.dispatch(stopTimer(uuid, "menuMainArray")); //remove menu
        if(this.props.state.updateFromCreate){
          this.props.dispatch(importNode(newNode)); //import into neo4j
        }
      }
      
      cycleIndex(uuid, direction, type){
        this.resetTimer(uuid);
        let variable = type + "CurrentIndex";
        let index;
        if(direction){
          if((this.props.state[type].length-1) == this.state[variable]){
            index = 0;
          }else{
            index = this.state[variable] + 1;
          }
        }else{
          if(this.state[variable] == 0){
            index = this.props.state[type].length-1;
          }else{
            index = this.state[variable] - 1;
          }
        }
        this.setState({[variable]:index});
      }
      
      toggleProp(uuid, propName){
        this.resetTimer(uuid);
        this.props.dispatch(SET(propName, !(this.props.state[propName])));
      }
      
      
      /*
      * This Code was written by Chris Viau’s on Bl.ock.org, block id: 8187844  6th of August, 2017
      * http://bl.ocks.org/biovisualize/8187844
      */
      svgToPNG(){
        let svgOriginal = document.querySelector('svg'); //get for reference
        let svgClone = svgOriginal.cloneNode(true); //clone so we don't mess the original
        // generate style definitions on the svg element(s)
        svgClone = this.generateStyleDefs(svgClone);//document.getElementById("svg"));
        let menus = svgClone.getElementById('menus'); //filter out the menus
        svgClone.removeChild(menus);
        let svgString = new XMLSerializer().serializeToString(svgClone);
        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth -40;
        canvas.height = window.innerHeight -40;
        let ctx = canvas.getContext("2d");
        let DOMURL = self.URL || self.webkitURL || self;
        let img = new Image();
        let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
        let url = DOMURL.createObjectURL(svg);
        img.onload = function() {
          ctx.drawImage(img, 0, 0);
          let imgURI = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
          /*
          * Code was written by worstenbrood from StackOverflow on 26th June 2017 at 21:40
          * https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098
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
      
      
      /*
      * Code written by R. Oosterholt from Stackoverflow on 11th of August 2015 at 18:36
      * https://stackoverflow.com/questions/20394041/convert-svg-to-png-and-maintain-css-integrity
      */ 
      generateStyleDefs(svgDomElement) {
        let styleDefs = "";
        let sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
          if(sheets[i].href !== "https://fonts.googleapis.com/css?family=Roboto"){
          let rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            let rule = rules[j];
            if (rule.style) {
              let selectorText = rule.selectorText;
              let elems = svgDomElement.querySelectorAll(selectorText);
              if (elems.length) {
                styleDefs += selectorText + " { " + rule.style.cssText + " }\n";
              }
            }
          }
        }
      }
      let s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = styleDefs;
      let defs = document.createElement('defs');
      defs.appendChild(s);
      svgDomElement.insertBefore(defs, svgDomElement.firstChild);
      return svgDomElement;
    }
    
    
    svgToJSON(){
      let nodes = _.cloneDeep(this.props.state.nodes);
      let edges = _.cloneDeep(this.props.state.links);
      nodes.map((node) =>{
        node.text = node.text.join(" ");
        delete (node.date);
        delete (node.time);
        delete (node.layer);
        delete (node.x);
        delete (node.y);
      });
      edges.map((edge)=>{
        edge.fromID = edge.source;
        edge.toID = edge.target;
        delete (edge.source);
        delete (edge.target);
        if(edge.formEdgeID === "null"){
          edge.formEdgeID = null;
        }
      });
      let jsonObject = {nodes, edges, locutions:[]};
      let str = JSON.stringify(jsonObject);
      let jsonUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
      /*
      * Code was written by worstenbrood from StackOverflow on 26th June 2017 at 21:40
      * https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098
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
            <rect fill="white" x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={this.state.menu_height*3} key={'displayOption' + menu.uuid} onClick={()=>this.resetTimer(menu.uuid)} style={{stroke:'black', strokeWidth:'1px'}}/>
            {this.state.clickedOption(menu.uuid)}
            </g>
          );        
        }
      }
    }
    
    
    renderMenuItem = (menuObject, index, uuid) => {
      if(menuObject.hasOwnProperty("title1_part1")){
        return ( 
          <g key ={'ItemGroup' + index + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'SectionMenuBox1' + index + "_" + uuid} fill="white" onClick={() => {menuObject.onClick(uuid);}}/>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height * .25) + (index * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment11")} key ={'SectionMenuText1' + index + "_" + uuid}>{menuObject.title1_part1}</text>
          <text x={this.state.menuItemTextXOrigin - this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (index * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment14")} key ={'SectionMenuText2' + "_" + uuid}>{menuObject.title1_part2}</text>
          <rect x={this.state.origin + this.state.menu_width/2} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width/2} height={(this.state.menu_height)} className="menuItemRect" key={'SectionMenuBox2' + "_" + uuid} fill="white" onClick={()=>{menuObject.onClick2(uuid);}}/>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin - (this.state.menu_height * .25) + (index * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment11")} key ={'SectionMenuText3' + index + "_" + uuid} >{menuObject.title2_part1}</text>
          <text x={this.state.menuItemTextXOrigin + this.state.menu_width/4} y={this.state.menuItemTextYOrigin + (this.state.menu_height * .25) + (index * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment14")} key ={'SectionMenuText4' + "_" + uuid}>{menuObject.title2_part2}</text>
          </g>
        );
      }else{
        return ( 
          <g key ={'ItemGroup' + index + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'menuRect' + index + "_" + uuid} fill="white" onClick={() => {menuObject.onClick(uuid);}}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (index * this.state.menu_height)} className={classnames("fontAdjustment18", "menuItem")} key ={'MenuItem' + index + "_" + uuid} >{menuObject.title}</text>
          </g>
        );
      }
    }
    
    
    render() {
      let menu = this.props.menu;
      let transform = "translate(" + (menu.x - 40) + "," + (menu.y - 40) + ")"; //minus margins
      let pathTransform = "translate(" + (this.state.origin + (this.state.menu_width * .825)) + "," + (this.state.origin +1) +") " + "scale( " + (1* this.props.state.averagedScale) + "," + (1* this.props.state.averagedScale)  + ")";
      return(
        <g transform={transform} key={menu.uuid} >
        {<rect x={this.state.origin-(this.state.origin*0.3)} y={this.state.origin -(this.state.origin*0.2)} width={this.state.menu_width*1.1} height={this.state.menu_height*4.2} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"0.0", fill:'none'}}/> }{/* stops touches conflicting */} {/*onClick={()=>this.resetTimer(menu.uuid)}*/}
        <rect x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'menuMainRect' + menu.x + menu.y} fill="white"  style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
        {this.state.layer > 0 ? 
          <g>
          <rect fill="white" width={25} height={25} transform={pathTransform} onClick={()=>this.clickBack(menu.uuid)}/>
          {/*PATH d for Left Arrow taken from https://material.io/*/}
          <path stroke={"black"} d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" transform={pathTransform} style={{fill:"black"}} onClick={()=>this.clickBack(menu.uuid)}/>
          </g>
          :
          <g>
          <rect fill="white" width={25} height={25} transform={pathTransform} onClick={()=>this.cancelTimer(menu.uuid)}/>
           {/*PATH d for Cancel taken from https://material.io/*/}
          <path stroke={"black"} d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10,s10,-4.47,10,-10,S17.53,2,12,2,Zm5,13.59L15.59,17L12,13.41L8.41,17L7,15.59L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59Z" transform={pathTransform} style={{fill:"black"}} onClick={()=>this.cancelTimer(menu.uuid)}/>
          </g>
        }
        <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.3)} className={classnames("menuDetails", "fontAdjustment12_E")} key={'menuMainArrayDetails1' + menu.x + menu.y} >{"Nodes: (" + this.props.state.nodes.length + ")"}</text>
        <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.6)} className={classnames("menuDetails", "fontAdjustment12_E")} key={'menuMainArrayDetails2' + menu.x + menu.y} >{"Edges: (" + this.props.state.links.length + ")"}</text>
        {
          this.props.state.updateAvailable
          ?
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className={classnames("menuDetails", "fontAdjustment12_E")} key={'menuMainArrayDetails3' + menu.x + menu.y} stroke="none" fill="red">{"Update Available!"}</text>
          :
          <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className={classnames("menuDetails", "fontAdjustment12_E")} key={'menuMainArrayDetails3' + menu.x + menu.y} >{"Last updated: " + this.props.state.lastUpdated}</text>
        }
        {this.menuItems(menu)}
        </g>
      );
    }
    
  }
  
  export default MenuMain;
