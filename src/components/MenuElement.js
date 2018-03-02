import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { UPDATE, DROP } from 'reducerActions';
import { addToTimer, stopTimer } from 'utilities/Timer';
import {makeEdge} from 'utilities/Edge';
import {importEdge, updateNode, removeNode, removeEdges} from 'utilities/CypherIO';
import {wrapNonContextTextToArray} from 'utilities/WrapText';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class MenuElement extends React.Component {
  
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
    let connectedEdges = _.filter(this.props.state.links, {"source":this.props.menu.nodeID});
    connectedEdges = connectedEdges.concat(_.filter(this.props.state.links, {"target":this.props.menu.nodeID}));
    this.state = {
      menu_width,
      menu_height,
      origin,
      menuItemRectYOrigin,
      menuItemTextXOrigin: (origin+(menu_width/2)),
      menuItemTextYOrigin: (menuItemRectYOrigin+(menu_height/1.75)),
      layer:0,
      menuElementArrayLayer0:[
        {title:"Create Edge", onClick:(uuid) => this.state.distancesToTarget.length > 1 && this.clickCreateEdge(uuid)}, 
        {title:"Edit Node", onClick:(uuid) => this.clickEditNode(uuid)}, 
        {title:"Delete..", onClick:(uuid) => this.clickDelete(uuid)}],
        menuElementArrayLayer1:[
          {title:"Node", onClick:(uuid) => this.deleteNode(uuid)}, 
          {title:"OR", onClick:(uuid) => this.resetTimer(uuid)}, 
          {title:"Edge..", onClick:(uuid) => this.clickDeleteEdges(uuid)}],
          clickedOption: ()=>{},
          colourTag:this.getRandomColor(),
          nodeTypesCurrentIndex:0,
          nodeTargetCurrentIndex:1,
          distancesToTarget,
          connectedEdgesCurrentIndex:0,
          connectedEdges,
        };
      }  
      
      componentWillUnmount(){
        this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
        this.props.dispatch(DROP("highlightedEdges", "color", {color:this.state.colourTag}));
      }
      
      /* Code written by Anatoliy from Stackoverflow on 27th Sep 2009 at 21:25
      * https://stackoverflow.com/questions/1484506/random-color-generator
      */
      getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
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
        
        resetTimer = (uuid) => {
          this.props.dispatch(addToTimer(uuid, "menuElementArray"));
        }
        
        clickBack = (uuid) => {
          this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
          this.props.dispatch(DROP("highlightedEdges", "color", {color:this.state.colourTag}));
          this.props.dispatch(addToTimer(uuid, "menuElementArray"));
          this.setState({layer: 0});
        }
        
        //element menu option click
        clickCreateEdge = (uuid) =>{
          this.props.dispatch(UPDATE("highlightedNodes", {nodeID:this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode, color:this.state.colourTag}));
          this.resetTimer(uuid);
          this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionCreateEdge(uuid)});
        }
        
        clickEditNode = (uuid) =>{
          this.resetTimer(uuid);
          this.setState({layer: 1, clickedOption:(uuid)=>this.displayOptionEditNode(uuid)});
        }
        
        clickDelete = (uuid) => {
          this.resetTimer(uuid);
          this.setState({layer: 2});
        }

        clickDeleteEdges = (uuid) => {
          if(this.state.connectedEdges.length > 0){
            this.props.dispatch(UPDATE("highlightedEdges", {source:this.state.connectedEdges[this.state.connectedEdgesCurrentIndex].source, target:this.state.connectedEdges[this.state.connectedEdgesCurrentIndex].target, color:this.state.colourTag}));
            this.resetTimer(uuid);
            this.setState({layer:3});
          }
        }


        //Element menu display option
        displayOptionCreateEdge = (uuid) =>{
          return(
            <g key ={'createEdge' + "_" + uuid}>
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'createEdgeBox' + "_" + uuid}/>
            <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18")} key={'createEdgeBoxText' + "_" + uuid} >[Tap to Choose]</text>
            
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'CreateEdgeTarget' + "_" + uuid} onClick={()=>{this.cycleDistanceIndex(uuid);}}/>
            <text x={this.state.origin + (this.state.menu_width*.25)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")}  key ={'CreateEdgeTargetText' + "_" + uuid}> Target:</text>
            <text x={this.state.origin + (this.state.menu_width*.75)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} 
            style={{ stroke:this.state.colourTag, strokeWidth:"2" }} 
            key={'createEdgeBoxTarget' + "_" + uuid}> 
            {this.state.distancesToTarget.length > 1 && this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode}
            </text>
            
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'createEdgeButton' + "_" + uuid} onClick={()=>{this.createEdge(uuid);}}/>
            <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem","fontAdjustment18")} key ={'createEdgeButtonText' + "_" + uuid} >Create</text>
            </g>
          );
        }
        
        displayOptionEditNode = (uuid) =>{
          let node = _.find(this.props.state.nodes, { "nodeID": this.props.menu.nodeID });
          return(
            <g key ={'editEdge' + "_" + uuid}>
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'editEdgeBox' + "_" + uuid}/>
            <text x={this.state.origin} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18_E")} key={'editEdgeCurrentText' + "_" + uuid} >Current Type:</text>
            <text x={this.state.origin + (this.state.menu_width*.80)} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18")} key={'editEdgeBoxCurrentText' + "_" + uuid} >{node.type}</text>
            
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'editEdgeTarget' + "_" + uuid} onClick={()=>{this.cycleIndex(uuid,"nodeTypes");}}/>
            <text x={this.state.origin} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18_E")} key={'editEdgeBoxTarget' + "_" + uuid}>{this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].name}</text>
            
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'editEdgeButton' + "_" + uuid} onClick={()=>{this.editNode(uuid);}}/>
            <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem","fontAdjustment18")} key ={'editEdgeButtonText' + "_" + uuid} >Ammend</text>
            </g>
          );
        }

        displayOptionDeleteEdges = (uuid) =>{
          return(
          <g key ={'deleteEdges' + "_" + uuid}>
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={(this.state.menu_height)} className="menuItemRect" key={'deleteEdgesBox' + "_" + uuid}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin} className={classnames("menuItem", "fontAdjustment18")} key={'deleteEdgesBoxText' + "_" + uuid} >[Tap to Choose]</text>
          
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (1 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'deleteEdgesTarget' + "_" + uuid} onClick={()=>{this.cycleEdges(uuid);}}/>
          <text x={this.state.origin  + (this.state.menu_width*.25)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} key ={'deleteEdgesTargetText' + "_" + uuid}> Target:</text>
          <text x={this.state.origin + (this.state.menu_width*.75)} y={this.state.menuItemTextYOrigin + (1 * this.state.menu_height)} className={classnames("menuItem", "fontAdjustment18")} 
          style={{ stroke:this.state.colourTag, strokeWidth:"2" }} 
          key={'deleteEdgesBoxTarget' + "_" + uuid}> 
          {this.state.connectedEdges[this.state.connectedEdgesCurrentIndex].edgeID}
          </text>
          
          <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (2 * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'deleteEdgesButton' + "_" + uuid} onClick={()=>{this.deleteEdge(uuid);}}/>
          <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (2 * this.state.menu_height)} className={classnames("menuItem","fontAdjustment18")} key ={'deleteEdgesButtonText' + "_" + uuid} >Delete Edge</text>
          </g>
          );
        }
        
        createEdge(uuid){
          let menu = this.props.menu;
          let source = _.find(this.props.state.nodes, { "nodeID": menu.nodeID }),
          target = _.find(this.props.state.nodes, {"nodeID": this.state.distancesToTarget[this.state.nodeTargetCurrentIndex].targetNode} );
          if(!_.find(this.props.state.links, { "source": source.nodeID, "target": target.nodeID})){ //if edge does not already exist
            let newEdge = makeEdge(source, target);
            this.props.dispatch(UPDATE("links", newEdge)); //update local nodes
            this.props.dispatch(stopTimer(uuid, "menuElementArray")); //remove menu
            if(this.props.state.updateFromCreate){
              this.props.dispatch(importEdge(newEdge)); //import edges into neo4j
            }
          }
          this.props.dispatch(stopTimer(uuid, "menuElementArray")); //remove menu
        }
        
        editNode(uuid){
          this.props.dispatch(stopTimer(uuid, "menuElementArray")); //remove menu
          let menu = this.props.menu;
          let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
          let amendedNode = _.cloneDeep(node);//we clone to not mess with physics
          this.props.dispatch(DROP("nodes", "nodeID", node)); //update local nodes
          amendedNode.type = this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type;
          if(!this.props.state.defaultNodeTypes.includes(this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].type)){
            amendedNode.text = wrapNonContextTextToArray(this.props.state.nodeTypes[this.state.nodeTypesCurrentIndex].name);
          }
          this.props.dispatch(UPDATE("nodes", amendedNode)); //update local nodes
          if(this.props.state.updateFromCreate){
            this.props.dispatch(updateNode(amendedNode)); //import edges into neo4j
          }
        
        }
        
        deleteNode(uuid){
          this.props.dispatch(stopTimer(uuid, "menuElementArray")); //remove menu
          let menu = this.props.menu;
          let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
          let nodeToDelete = _.cloneDeep(node);
          
          
          //remove edges associated with node!!
          let edgesToDelete = _.filter(this.props.state.links, {"source":nodeToDelete.nodeID});
          edgesToDelete = edgesToDelete.concat(_.filter(this.props.state.links, {"target":nodeToDelete.nodeID}));
          
          //Drop edges and nodes from local
          edgesToDelete && edgesToDelete.map((edge)=>{ 
            this.props.dispatch(DROP("links", "edgeID", edge));
          });
          this.props.dispatch(DROP("nodes", "nodeID", node)); //update local nodes
          
          if(this.props.state.updateFromCreate){
            //drop from remote
            if(edgesToDelete.length > 0){
              this.props.dispatch(removeEdges(edgesToDelete)).then(()=>{
                this.props.dispatch(removeNode(nodeToDelete));
              }); 
            }else{
              this.props.dispatch(removeNode(nodeToDelete));
            }
          }
        }

        deleteEdge(uuid){
          this.props.dispatch(stopTimer(uuid, "menuElementArray")); //remove menu
          
          let edgeToDelete = this.state.connectedEdges[this.state.connectedEdgesCurrentIndex];
          
          //drop Local
          this.props.dispatch(DROP("links", "edgeID", edgeToDelete));
          
          if(this.props.state.updateFromCreate){
            //drop from remote
            this.props.dispatch(removeEdges(edgeToDelete)); 
          }
        }

        cycleEdges(uuid){
          this.props.dispatch(DROP("highlightedEdges", "color", {color:this.state.colourTag}));
          this.resetTimer(uuid);
          let index = 0;
          if((this.state.connectedEdges.length-1) != this.state.connectedEdgesCurrentIndex){
            index = this.state.connectedEdgesCurrentIndex + 1;
          }
          this.setState({connectedEdgesCurrentIndex:index});
          this.props.dispatch(UPDATE("highlightedEdges", {source:this.state.connectedEdges[index].source, target:this.state.connectedEdges[index].target, color:this.state.colourTag}));
        }
        
        
        cycleDistanceIndex(uuid){
          this.props.dispatch(DROP("highlightedNodes", "color", {color:this.state.colourTag}));
          let index = 1;
          this.resetTimer(uuid);
          if((this.state.distancesToTarget.length-1) != this.state.nodeTargetCurrentIndex){
            index = this.state.nodeTargetCurrentIndex + 1;
          }
          this.setState({nodeTargetCurrentIndex:index});
          this.props.dispatch(UPDATE("highlightedNodes", {nodeID:this.state.distancesToTarget[index].targetNode, color:this.state.colourTag}));
        }
        
        cycleIndex(uuid, type){
          this.resetTimer(uuid);
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
                <rect fill="white" x={this.state.origin} y={this.state.menuItemRectYOrigin} width={this.state.menu_width} height={this.state.menu_height*3} key={'displayOption' + menu.uuid} onClick={()=>this.resetTimer(menu.uuid)} style={{stroke:'black', strokeWidth:'1px', fill:'#FF8A80'}}/>
                {this.state.clickedOption(menu.uuid)}
                </g>
              );        
            }
            case 2:{
              return (this.state[menu.type + "Layer1"].map((title, index) => {
                return this.renderMenuItem(title, index, menu.uuid);
              }));
            }
            case 3:{
              return this.displayOptionDeleteEdges(menu.uuid);
            }
          }
        }
        
        renderMenuItem = (menuObject, index, uuid) => {
          return ( 
            <g key ={'ItemGroup' + index + "_" + uuid}>
            <rect x={this.state.origin} y={this.state.menuItemRectYOrigin + (index * this.state.menu_height)} width={this.state.menu_width} height={this.state.menu_height} className="menuItemRect" key={'menuRect' + index + "_" + uuid} fill="white" onClick={() => menuObject.onClick(uuid)}/>
            <text x={this.state.menuItemTextXOrigin} y={this.state.menuItemTextYOrigin + (index * this.state.menu_height)} className={classnames("menuItem","fontAdjustment18")} key ={'MenuItem' + index + "_" + uuid} >{menuObject.title}</text>
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
            {<rect x={this.state.origin-(this.state.origin*0.3)} y={this.state.origin -(this.state.origin*0.2)} width={this.state.menu_width*1.1} height={this.state.menu_height*4.2} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"0.0", fill:'none'}}/> } {/* stops touches conflicting */}
            <rect fill="white" x={this.state.origin} y={this.state.origin} width={this.state.menu_width} height={this.state.menu_height} key={'elementRect' + node.nodeID} onClick={()=>this.resetTimer(menu.uuid)} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
            {this.state.layer > 0 ? 
              <g>
              <rect fill="white" width={25} height={25} transform={pathTransform} onClick={()=>this.clickBack(menu.uuid)}/>
              <path stroke={"black"} d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" transform={pathTransform} style={{fill:"black"}} onClick={()=>this.clickBack(menu.uuid)}/>
              </g>
              :
              <g/>
            }
            <text x={this.state.origin*2} y={this.state.origin + (this.state.menu_height *.3)} className={classnames("menuDetails", "fontAdjustment12")} key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
            <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.6)} className={classnames("menuDetails", "fontAdjustment12")} key={'elementDetails2' + node.nodeID} >{"Date: " + node.date}</text>
            <text x={this.state.origin*1.2} y={this.state.origin + (this.state.menu_height *.9)} className={classnames("menuDetails", "fontAdjustment12")} key={'elementDetails3' + node.nodeID} >{"Time: " + node.time}</text>
            {this.menuItems(menu)}
            </g>
          );
        }
        
      }
      
      export default MenuElement;