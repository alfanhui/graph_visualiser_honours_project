import React from 'react';
import { Link } from 'react-router-dom'; //this solves everything (react warning comments removed with dom'ing this.)
import { connect } from "react-redux";
import _ from 'lodash';
import { SET, UPDATE } from 'reducerActions';
import getUuid from 'uuid/v1';
import ForceDirected from './Layout_ForceDirected';
import Tree from './Layout_Tree';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';


let drag = {
  elm: null,
  transform: [],
  currentX: 0,
  currentY: 0,
  state: false,
  moved: false
}

//********* this is a style and should be moved to ./styles
const menuItem = { 
  fontSize: '10px',
  lineHeight: '15px',
  padding: '0px 15px',
  minHeight: '25px',
  backgroundColor: 'white',
  position: 'fixed !important'
};


@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class InteractionEvents extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  
  onNewMouseStart = (event) => {
    if (event.target.getAttribute("id") == "main") {
      let uuid = getUuid();
      let timerID = setTimeout(() => { this.timeOutMain(); }, 3000, uuid);
      let newMenu = { x: event.clientX, y: event.clientY, uuid, timerID };
      this.props.dispatch(UPDATE("mainMenu", newMenu));
      console.log("main menu open");
    } else {
      if (!drag.state) {
        drag.elem = event.target;
        drag.currentX = event.clientX,
        drag.currentY = event.clientY;
        let transform = event.target.getAttributeNS(null, "transform").slice(10, -1).split(',');
        drag.transform = transform.map(parseFloat);
        drag.state = true;
      }
      return false;
    }
  }
  
  onNewMouseMove = (event) => {
    if (drag.state) {
      drag.moved = true;
      let node = _.find(this.props.state.nodes, { "nodeID": drag.elem.getAttribute("id") })
      node.x = drag.transform[0] += event.clientX - drag.currentX;
      node.y = drag.transform[1] += event.clientY - drag.currentY;
      let node_props = this.updateNode(this.props.state.nodes, { "nodeID": drag.elem.getAttribute("id") }, node);
      this.props.dispatch(SET("nodes", node_props));
      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
    }
  }
  
  //https://stackoverflow.com/questions/27641731/is-there-a-function-in-lodash-to-replace-matched-item
  //24th of Dec 2014 at 20:24
  //User dfsq from stackoverflow
  updateNode(arr, key, newval) {
    let match = _.find(arr, key);
    match ? arr.splice(_.findIndex(arr, key), 1, newval) : arr.push(newval);
    return arr;
  }
  
  onNewMouseUp = (event) => {
    if (drag.state) { //had hit element
      if (!drag.moved) {
        let uuid = getUuid();
        let timerID = setTimeout(() => { this.timeOutElement(); }, 3000, uuid);
        let newMenu = { x: event.clientX, y: event.clientY, uuid, timerID };
        this.props.dispatch(UPDATE("elementMenu", newMenu));
        console.log("element menu open", drag.elem);
      }
      drag.state = drag.moved = false;
    }
  }
  
  timeOutMain = (uuid) => {
    let menu = this.props.state.mainMenu;
    const newMenu = menu.filter(obj => obj.uuid == uuid);
    console.log(newMenu);
    this.props.dispatch(SET("mainMenu", newMenu));
  }
  
  timeOutElement = (uuid) => {
    console.log(this.props.state.elementMenu);
    let menu = this.props.state.elementMenu;
    const newMenu = menu.filter(obj => obj.uuid == uuid);
    console.log(newMenu);
    this.props.dispatch(SET("elementMenu", newMenu));
  }

  mainMenu = (nextMenu) => {
    let transform = 'translate(' + (nextMenu.x - 40) + ',' + (nextMenu.y - 40) + ')'; //minus margins
    return (
        <g key={"MM" + nextMenu.x + nextMenu.y} transform={transform}>
            <foreignObject width='96' height='107'>
                <Menu desktop={true}>
                    <MenuItem style={menuItem} primaryText="Database" disabled={true} />
                    <MenuItem style={menuItem} primaryText="Graph" disabled={true} />
                    <MenuItem style={menuItem} primaryText="Options" disabled={true} />
                </Menu>
            </foreignObject>
        </g>
    );
}

elementMenu = (nextMenu) => {
    let transform = 'translate(' + (nextMenu.x - 40) + ',' + (nextMenu.y - 40) + ')'; //minus margins
    return (
        <g key={"EM" + nextMenu.x + nextMenu.y} transform={transform}>
            <foreignObject width='96' height='107'>
                <Menu desktop={true}>
                    <MenuItem style={menuItem} primaryText="Create edge" disabled={true} />
                    <MenuItem style={menuItem} primaryText="Edit node" disabled={true} />
                    <MenuItem style={menuItem} primaryText="Delete node" disabled={true} />
                </Menu>
            </foreignObject>
        </g>
    );
}
  
  
  
  render(){
    return(
      <div>
        {this.props.state.layout == "FORCE" ?
      <ForceDirected 
      onMouseDown={this.onNewMouseStart}   
      onMouseMove={this.onNewMouseMove} 
      onMouseUp={this.onNewMouseUp} 
      mainMenu={this.mainMenu}
      elementMenu={this.elementMenu}/>
        :
      <Tree 
      onMouseDown={this.onNewMouseStart}   
      onMouseMove={this.onNewMouseMove} 
      onMouseUp={this.onNewMouseUp} 
      mainMenu={this.mainMenu}
      elementMenu={this.elementMenu}/>
        }
      </div>
    );
  }
}

export default InteractionEvents;
