import React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SET, UPDATE } from 'reducerActions';
import getUuid from 'uuid/v1';
import ForceDirected from './Layout_ForceDirected';
import Tree from './Layout_Tree';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
//import Tuio from 'tuio-nw';

let drag = {
  elm: null,
  transform: [],
  currentX: 0,
  currentY: 0,
  state: false,
  moved: false
};

/*
var client = new Tuio.Client({
  host: '10.201.226.69',
  port: 3333
});
*/


//********* this is a style and should be moved to ./styles
const menuItem = {
  //fontSize: '10px',
  //lineHeight: '15px',
  //padding: '0px 15px',
  //minHeight: '25px',
  backgroundColor: 'white',
  position: 'fixed !important'
};

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class InteractionEvents extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object
  };
  
  constructor(props) {
    super(props);
    this.state = {
      currentTouches: [],
      log: "",
    };
    //client.listen();
  }
  
  componentWillMount(){
    
  }
  
  onNewMouseStart = (event) => {
    event.stopPropagation();
    if (event.target.getAttribute("id") == "main") {
      let uuid = getUuid();
      let timerID = setTimeout((uuid) => { this.timeOutMain(uuid); }, 3000, uuid);
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
    event.stopPropagation();
    if (drag.state) {
      drag.moved = true;
      let node = _.find(this.props.state.nodes, { "nodeID": drag.elem.getAttribute("id") });
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
    event.stopPropagation();
    if (drag.state) { //had hit element
      if (!drag.moved) {
        let uuid = getUuid();
        let timerID = setTimeout((uuid) => { this.timeOutElement(uuid); }, 3000, uuid);
        let newMenu = { x: event.clientX, y: event.clientY, uuid, timerID };
        this.props.dispatch(UPDATE("elementMenu", newMenu));
        console.log("element menu open", drag.elem);
      }
      drag.state = drag.moved = false;
    }
  }
  
  timeOutMain = (uuid) => {
    let menu = this.props.state.mainMenu;
    const newMenu = menu.filter(obj => obj.uuid !== uuid);
    this.props.dispatch(SET("mainMenu", newMenu));
  }
  
  timeOutElement = (uuid) => {
    let menu = this.props.state.elementMenu;
    const newMenu = menu.filter(obj => obj.uuid !== uuid);
    this.props.dispatch(SET("elementMenu", newMenu));
  }
  
  mainMenu = (nextMenu) => {
    let transform = "translate(" + (nextMenu.x - 40) + "," + (nextMenu.y - 40) + ")"; //minus margins
    return (
      <g key={"MM" + nextMenu.x + nextMenu.y} transform={transform}>
      <foreignObject width="96" height="107">
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
    let transform = "translate(" + (nextMenu.x - 40) + "," + (nextMenu.y - 40) + ")"; //minus margins
    let node = _.find(this.props.state.nodes, { "nodeID": nextMenu.nodeID });
    let date = node.timestamp.split(" ")[0].split("-");
    date = date[2] + "/" + date[1] + "/" + date[0]
    let time = node.timestamp.split(" ")[1];
    return (
      <g key={"EM" + nextMenu.x + nextMenu.y} transform={transform}>
        <rect x={20} y={20} width={130} height={40} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
        <text x={40} y={30} className="ContentText" key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
        <text x={25} y={43} className="ContentText" key={'elementDetails2' + node.nodeID} >{"DATE: " + date}</text>
        <text x={25} y={56} className="ContentText" key={'elementDetails3' + node.nodeID} >{"TIME: " + time}</text>
        <foreignObject x="20" y="45" width="96" height="107">
        <Menu desktop={true}>
        <MenuItem style={menuItem} primaryText="Create edge" disabled={true} />
        <MenuItem style={menuItem} primaryText="Edit node" disabled={true} />
        <MenuItem style={menuItem} primaryText="Delete node" disabled={true} />
        </Menu>
        </foreignObject>
      </g>
    );
  }
  
  touchStart = (event) => {
    event.stopPropagation();
    this.setState({ log: "touchStart" });
    let touches = event.changedTouches;
    let $currentTouches = this.state.currentTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      if (event.target.getAttribute("id") == "main") {
        let uuid = getUuid();
        let timerID = setTimeout((uuid) => { this.timeOutMain(uuid); }, 3000, uuid);
        let newMenu = { x: touch.clientX, y: touch.clientY, uuid, timerID};
        this.props.dispatch(UPDATE("mainMenu", newMenu));
      } else {
        let transform = touch.target.getAttributeNS(null, "transform").slice(10, -1).split(',');
        $currentTouches.push({
          "id": touch.identifier,
          "elem": touch.target,
          "currentX": touch.clientX,
          "currentY": touch.clientY,
          "transform": transform.map(parseFloat),
          "state": true,
        });
      }
      this.setState({ currentTouches: $currentTouches });
    }
  }
  
  
  
  touchMove = (event) => {
    event.stopPropagation();
    this.setState({ log: "touchMove" });
    let $currentTouches = this.state.currentTouches;
    for (let i = 0; i < event.changedTouches.length; i++) {
      let touch = event.changedTouches[i];
      let currentTouchIndex = _.findIndex($currentTouches, function (currentTouch) { return currentTouch.id == touch.identifier; });
      if (currentTouchIndex >= 0) {
        let currentTouch = $currentTouches[currentTouchIndex];
        if (currentTouch.state) {
          currentTouch.moved = true;
          let node = _.find(this.props.state.nodes, { "nodeID": currentTouch.elem.getAttribute("id") });
          node.x = currentTouch.transform[0] += touch.clientX - currentTouch.currentX;
          node.y = currentTouch.transform[1] += touch.clientY - currentTouch.currentY;
          let node_props = this.updateNode(this.props.state.nodes, { "nodeID": currentTouch.elem.getAttribute("id") }, node);
          this.props.dispatch(SET("nodes", node_props));
          currentTouch.currentX = touch.clientX;
          currentTouch.currentY = touch.clientY;
        }
        $currentTouches.splice(currentTouchIndex, 1, currentTouch);
      } else {
        console.log("Touch was not found!");
      }
      this.setState({ currentTouches: $currentTouches });
    }
    
  }
  
  
  touchEnd = (event) => {
    event.stopPropagation();
    let $currentTouches = this.state.currentTouches;
    for (let i = 0; i < event.changedTouches.length; i++) {
      let touch = event.changedTouches[i];
      let currentTouchIndex = _.findIndex($currentTouches, function (currentTouch) { return currentTouch.id == touch.identifier; });
      if (currentTouchIndex >= 0) {
        let currentTouch = $currentTouches[currentTouchIndex];
        if (currentTouch.state) { //had hit element
          if (!currentTouch.moved) {
            let uuid = getUuid();
            let timerID = setTimeout((uuid) => { this.timeOutElement(uuid); }, 5000, uuid);
            let newMenu = { x: touch.clientX, y: touch.clientY, uuid, timerID, nodeID: event.target.id};
            this.props.dispatch(UPDATE("elementMenu", newMenu));
          }
          currentTouch.state = currentTouch.moved = false;
          
          //remove record
          $currentTouches.splice(currentTouchIndex, 1);
          this.setState({ currentTouches: $currentTouches });
        } else {
          console.log("Touch was not found!");
        }
      }
    }
  }
  
  touchCancel = (event) => {
    event.stopPropagation();
    let $currentTouches = this.state.currentTouches;
    for (let i = 0; i < event.changedTouches.length; i++) {
      let touch = event.changedTouches[i];
      let currentTouchIndex = _.findIndex($currentTouches, function (currentTouch) { return currentTouch.id == touch.identifier; });
      if (currentTouchIndex >= 0) {
        // Remove the touch record.
        $currentTouches.splice(currentTouchIndex, 1);
        
      } else {
        console.log("Touch was not found!");
      }
    }
    this.setState({ currentTouches: $currentTouches });
  }
  
  
  
  
  render() {
    return (
      <div>
      {this.props.state.layout == "FORCE" ?
      <ForceDirected
      onMouseDown={this.onNewMouseStart}
      onMouseMove={this.onNewMouseMove}
      onMouseUp={this.onNewMouseUp}
      mainMenu={this.mainMenu}
      elementMenu={this.elementMenu}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
      onTouchEnd={this.touchEnd}
      onTouchCancel={this.touchCancel} />
      :
      <Tree
      onMouseDown={this.onNewMouseStart}
      onMouseMove={this.onNewMouseMove}
      onMouseUp={this.onNewMouseUp}
      mainMenu={this.mainMenu}
      elementMenu={this.elementMenu}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
      onTouchEnd={this.touchEnd}
      onTouchCancel={this.touchCancel} />
    }
    </div>
  );
}
}

export default InteractionEvents;