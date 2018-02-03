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
  
  render() {
    let {type, menu } = this.props;
    let transform = "translate(" + (menu.x - 40) + "," + (menu.y - 40) + ")"; //minus margins
    if(type == "main"){
      return (
        <g transform={transform}>
        <rect x={-50} y={-80} width={200} height={200} key={'touchborder' + + menu.x + menu.y} style={{fillOpacity:"0.0"}}/> {/* stops touches conflicting */}
        <rect x={origin} y={origin} width={110} height={30} key={'mainRect1' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 20} className="menuItem" key={'mainMenuItem1' + menu.x + menu.y}>Database</text>
        <rect x={origin} y={origin + 30} width={110} height={30} key={'mainRect2' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 50} className="menuItem" key={'mainMenuItem2' + + menu.x + menu.y}>Graph</text>
        <rect x={origin} y={origin + 60} width={110} height={30} key={'mainRect3' + + menu.x + menu.y} style={{stroke:'grey', strokeWidth:'0.25px', fill:'white'}}/>
          <text x={origin + 55} y={origin + 80} className="menuItem" key={'mainMenuItem3' + + menu.x + menu.y}>Options</text>
        </g>
      );
    }else{
      let node = _.find(this.props.state.nodes, { "nodeID": menu.nodeID });
      return(
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
  }
  
}

export default Menu;

/*


*/


/*

<foreignObject width="96" height="107">
<Menu desktop={true}>
<MenuItem style={menuItem} primaryText="Database" disabled={true} />
<MenuItem style={menuItem} primaryText="Graph" disabled={true} />
<MenuItem style={menuItem} primaryText="Options" disabled={true} />
</Menu>
</foreignObject>


*/


/*
<rect x={20} y={20} width={110} height={40} style={{stroke:'black', strokeWidth:'1px', fill:'white'}}/>
<text x={40} y={30} className="ContentText" key={'elementDetails1' + node.nodeID}>{"ID: " + node.type + "_" + node.nodeID}</text>
<text x={25} y={43} className="ContentText" key={'elementDetails2' + node.nodeID} >{"DATE: " + date}</text>
<text x={25} y={56} className="ContentText" key={'elementDetails3' + node.nodeID} >{"TIME: " + time}</text>
<foreignObject x="20" y="53" width="100" height="100">
<Menu>
<MenuItem style={menuItem} onClick={this.testClick}><div style={{position:'fixed'}}>Create edge</div></MenuItem>
<MenuItem style={menuItem} onClick={this.testClick}><div style={{position:'fixed'}}>Edit Node</div></MenuItem>
<MenuItem style={menuItem} onClick={this.testClick}><div style={{position:'fixed'}}>Delete Node</div></MenuItem>
</Menu>
</foreignObject>

*/