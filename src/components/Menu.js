import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import MenuList from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

let origin = 20;

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
    menuItems: PropTypes.array,
    menuType: PropTypes.string,
    menu: PropTypes.object
  };
  
  constructor(props) {
    super(props);
    this.state = {
      
    };
    
  }
  
  componentWillMount() {
    
  }
  
  componentDidMount() {
    
  }
  
  componentWillReceiveProps() {
    
  }
  
  componentWillUnmount() {
    
  }
  
  testClick = () => {
    console.log("Click");
  }

  renderMainMenu = (menu, transform) =>{
      return(
        <g transform={transform}>
        <rect x={-50} y={-100} width={200} height={250} key={'touchborder' + menu.x + menu.y} style={{fillOpacity:"0.0"}}/> {/* stops touches conflicting */}
        <rect x={origin} y={origin} width={110} height={40} key={'mainMenuRect' + menu.x + menu.y} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
          <text x={origin + 5} y={origin+ 10} className="ContentText" key={'mainMenuDetails1' + menu.x + menu.y} >{"Nodes: (" + this.props.state.nodes.length + ")"}</text>
          <text x={origin + 5} y={origin + 23} className="ContentText" key={'mainMenuDetails2' + menu.x + menu.y} >{"Edges: (" + this.props.state.links.length + ")"}</text>
          {
            this.props.state.updateAvailable
            ?
            <text x={origin + 5} y={origin + 36} className="ContentText" key={'mainMenuDetails3' + menu.x + menu.y} stroke="none" fill="red">{"Update Available!"}</text>
            :
            <text x={origin + 5} y={origin + 36} className="ContentText" key={'mainMenuDetails3' + menu.x + menu.y} >{"Last updated: " + this.props.state.lastUpdated}</text>
          }
          
        <rect x={origin} y={origin + 40} width={110} height={30} key={'mainRect1' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 60} className="menuItem" key={'mainMenuItem1' + menu.x + menu.y}>Database</text>
        <rect x={origin} y={origin + 70} width={110} height={30} key={'mainRect2' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 90} className="menuItem" key={'mainMenuItem2' + + menu.x + menu.y}>Graph</text>
        <rect x={origin} y={origin + 100} width={110} height={30} key={'mainRect3' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 120} className="menuItem" key={'mainMenuItem3' + + menu.x + menu.y}>Options</text>
        </g>
      );
  }  

  renderElementMenu = (menu, transform, node) => {
    return (
      <g transform={transform}>
      <rect x={-50} y={-100} width={200} height={250} key={'touchborder' + + menu.x + menu.y} style={{ fillOpacity:"0.0"}}/> {/* stops touches conflicting */}
      <rect x={origin} y={origin} width={110} height={40} key={'elementRect' + node.nodeID} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
        <text x={origin + 20} y={origin+ 10} className="ContentText" key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
        <text x={origin + 5} y={origin + 23} className="ContentText" key={'elementDetails2' + node.nodeID} >{"DATE: " + node.date}</text>
        <text x={origin + 5} y={origin + 36} className="ContentText" key={'elementDetails3' + node.nodeID} >{"TIME: " + node.time}</text>
      <rect x={origin} y={origin + 40} width={110} height={30} key={'elementRect1' + node.nodeID} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
        <text x={origin + 55} y={origin + 60} className="menuItem" key={'elementMenuItem1' + node.nodeID}>Create Edge</text>
      <rect x={origin} y={origin + 70} width={110} height={30} key={'elementRect2' + node.nodeID} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
        <text x={origin + 55} y={origin + 90}  className="menuItem" key={'elementMenuItem2' + node.nodeID}>Edit Node</text>
      <rect x={origin} y={origin + 100} width={110} height={30} key={'elementRect3' + node.nodeID} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
        <text x={origin + 55} y={origin + 120}  className="menuItem" key={'elementMenuItem3' + node.nodeID}>Delete Node</text>
      </g>
    );
  }
  
  render() {
    let {type, menu } = this.props;
    let transform = "translate(" + (menu.x - 40) + "," + (menu.y - 40) + ")"; //minus margins
    if(type == "main"){
      return this.renderMainMenu(menu, transform);
    }else{
      let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
      return this.renderElementMenu(menu, transform, node);
    }
  }
  
}

export default Menu;