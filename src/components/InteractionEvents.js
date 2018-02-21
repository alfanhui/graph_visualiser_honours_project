import React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SET} from 'reducerActions';
import getUuid from 'uuid/v1';
import ForceDirected from './LayoutForceDirected';
import Tree from './LayoutTree';
import { startTimer } from 'utilities/Timer';

let drag = {
  elm: null,
  transform: [],
  currentX: 0,
  currentY: 0,
  state: false,
  moved: false
};

let width = window.innerWidth - 40,
height = window.innerHeight - 40;

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class InteractionEvents extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    loadDatabase: PropTypes.func,
  };
  
  constructor(props) {
    super(props);
    let height = window.innerHeight - 40,
        width = window.innerWidth - 40;
    let defaultWidth = 1920 - 40,
        defaultHeight = 1080 - 40; 
    
    //if the screen is smaller, do not make the menus smaller.
    let scaledHeight = defaultHeight < height ?  ((height /defaultHeight)*.8) : 1,
        scaledWidth = defaultWidth < width ? ((width / defaultWidth)*.8) : 1;
    let averagedScale = (scaledHeight + scaledWidth) / 2;
    let menu_width = 150 * averagedScale, //original 110 x 30 
        menu_height = 40.9 * averagedScale;
    this.state = {
      currentTouches: [],
      log: "",
      boundaryWidth: (menu_width*.9),
      boundaryHeight: (menu_height*3.5),
    };

    this.props.dispatch(SET("averagedScale", averagedScale));
  }
  
  componentWillMount(){
    
    
  }
  
  
  touchStart = (event, mouseUse) => {
    event.stopPropagation();
    if(!mouseUse){
      event.preventDefault();
      let touches = event.changedTouches;
      let $currentTouches = this.state.currentTouches;
      for (let i = 0; i < touches.length; i++) {
        let touch = touches[i];
        if (event.target.getAttribute("id") == "main") {
          let {newX, newY} = this.deadZone(touch.clientX, touch.clientY);
          let uuid = getUuid();
          let newMenu = { x: newX, y: newY, uuid, type:"mainMenu"};
          this.props.dispatch(startTimer(newMenu));
        } else {
          let transform = touch.target.getAttributeNS(null, "transform").slice(10, -1).split(',');
          
          let currentX = touch.clientX, 
          currentY = touch.clientY;
          let node = _.find(this.props.state.nodes, { "nodeID": event.target.id });
          //issue with rotated nodes positing is not correct upon moving
          if(!this.props.state.defaultNodeTypes.includes(node.type)){ 
            currentX += (60*this.props.state.averagedScale);
            currentY += (5*this.props.state.averagedScale);
          }
          $currentTouches.push({
            "id": touch.identifier,
            "elem": touch.target,
            currentX,
            currentY,
            "transform": transform.map(parseFloat),
            "state": true,
          });
        }
        this.setState({ currentTouches: $currentTouches });
      }
    }else{
      if (event.target.getAttribute("id") == "main") {
        let {newX, newY} = this.deadZone(event.clientX, event.clientY);
        let uuid = getUuid();
        let newMenu = { x: newX, y: newY, uuid, type:"mainMenu"};
        this.props.dispatch(startTimer(newMenu));
      } else {
        if (!drag.state) {
          drag.elem = event.target;
          drag.currentX = event.clientX;
          drag.currentY = event.clientY;
          let node = _.find(this.props.state.nodes, { "nodeID": event.target.id });
          //issue with rotated nodes positing is not correct upon moving
          if(!this.props.state.defaultNodeTypes.includes(node.type)){ 
            drag.currentX += 60;
            drag.currentY += 5;
          }
          let transform = event.target.getAttributeNS(null, "transform").slice(10, -1).split(',');
          drag.transform = transform.map(parseFloat);
          drag.state = true;
        }
        return false;
      }
    }
  }
  
  
  
  touchMove = (event, mouseUse) => {
    event.stopPropagation();
    if(!mouseUse){
      event.preventDefault();
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
          //console.log("Touch was not found!");
        }
        this.setState({ currentTouches: $currentTouches });
      }
    }else{
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
  }
  
  
  touchEnd = (event, mouseUse) => {
    event.stopPropagation();
    if(!mouseUse){
      event.preventDefault();
      let $currentTouches = this.state.currentTouches;
      for (let i = 0; i < event.changedTouches.length; i++) {
        let touch = event.changedTouches[i];
        let currentTouchIndex = _.findIndex($currentTouches, function (currentTouch) { return currentTouch.id == touch.identifier; });
        if (currentTouchIndex >= 0) {
          let currentTouch = $currentTouches[currentTouchIndex];
          if (currentTouch.state) { //had hit element
            if (!currentTouch.moved) {
              let {newX, newY} = this.deadZone(touch.clientX, touch.clientY);
              let uuid = getUuid();
              let newMenu = { x: newX, y: newY, uuid,   type:"elementMenu", nodeID: event.target.id};
              this.props.dispatch(startTimer(newMenu));
            }
            currentTouch.state = currentTouch.moved = false;
            //remove record
            $currentTouches.splice(currentTouchIndex, 1);
            this.setState({ currentTouches: $currentTouches });
          } else {
            //console.log("Touch was not found!");
          }
        } 
      }
    }else{
      if (drag.state) { //had hit element
        if (!drag.moved) {
          let {newX, newY} = this.deadZone(event.clientX, event.clientY);
          let uuid = getUuid();
          let newMenu = { x: newX, y: newY, uuid, type:"elementMenu", nodeID: event.target.id };
          this.props.dispatch(startTimer(newMenu));
        }
        drag.state = drag.moved = false;
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
        //console.log("Touch was not found!");
      }
    }
    this.setState({ currentTouches: $currentTouches });
  }
  
  //https://stackoverflow.com/questions/27641731/is-there-a-function-in-lodash-to-replace-matched-item
  //24th of Dec 2014 at 20:24
  //User dfsq from stackoverflow
  updateNode(arr, key, newval) {
    let match = _.find(arr, key);
    match ? arr.splice(_.findIndex(arr, key), 1, newval) : arr.push(newval);
    return arr;
  }
  

  //touch boundary
  deadZone(x, y){
    let newX = x > (width-this.state.boundaryWidth) ? (width-this.state.boundaryWidth) : x ;
    let newY = y > (height-this.state.boundaryHeight) ? (height-this.state.boundaryHeight) : y ;
    return {newX, newY};
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
      resetTimer={this.resetTimer}
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
      resetTimer={this.resetTimer}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
      onTouchEnd={this.touchEnd}
      onTouchCancel={this.touchCancel} 
      loadDatabase={(dataFile)=>this.props.loadDatabase(dataFile)}/>
    }
    </div>
  );
}
}

export default InteractionEvents;