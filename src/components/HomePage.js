import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { postQuery, checkAddress } from 'utilities/DBConnection';
import { SET } from 'reducerActions';
import { convertRawToTree } from 'utilities/DataToTree';
import InteractionEvents from './InteractionEvents';
import { wrapContextTextToArray, wrapNonContextTextToArray } from 'utilities/WrapText';
import { importJSON } from 'utilities/CypherIO';
import hash from 'object-hash';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class HomePage extends React.Component {
  
  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object
  };
  
  constructor(props) {
    super(props);
    this.state = {
      currentHash: null,
    };
  }
  
  componentWillMount() {
    this.props.dispatch(checkAddress()).then(() => {
      this.loadDatabase();
    });
  }
  
  componentDidMount() {
    this.initPaper();
    //load data into nodes and links props.
  }
  
  componentDidUpdate() {
    
  }
  
  componentWillUnmount() {
    
  }


  
  loadDatabase(dataFile = null){
    //check the address of the database
    this.props.dispatch(SET("nodes", []));
    this.props.dispatch(SET("links", []));
    this.props.dispatch(SET("menuElementArray", []));
    this.props.dispatch(SET("loading", true));
    if(dataFile){
      this.props.dispatch(importJSON(dataFile)).then(() => {
        this.retrieveDataFromDatabase();
      });
    }else{
      this.retrieveDataFromDatabase();
    }
  }

  retrieveDataFromDatabase(){
    let nodes, links;
    this.props.dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
      this.props.dispatch(SET("updateAvailable", false));
      let now = Date.now();
      let hours = new Date(now).getHours(),
      minutes = new Date(now).getMinutes();
      if (minutes < 10){
        minutes = "0" + minutes;
      }
      this.props.dispatch(SET("lastUpdated", hours + ":" + minutes));
      this.setState({ currentHash: hash(result, { algorithm: 'md5' }) });
      nodes = this.convertNeo4jResult(result);
      //format data (wordwrap and other activities)
      nodes = this.formatNodes(nodes);
      this.props.dispatch(SET('nodes', nodes));
      //Grab edges   'START r=rel(*) WHERE NOT ((:L)-[r]->()) AND NOT (()-[r]->(:L)) RETURN r'
      this.props.dispatch(postQuery('START r=rel(*) RETURN r')).then((result) => {
        links = this.convertNeo4jResult(result);
        this.props.dispatch(SET('links', links));
      }).then(() => {
        if (this.props.state.layout == "TREE") {
          this.props.dispatch(convertRawToTree({ "nodes": nodes, "links": links }));
          this.updateScheduler();
        }
        this.props.dispatch(SET("loading", false));
      });
    });
  }
  
  //wraps the text, splits the date and time to readable formats
  formatNodes(nodes){
    nodes = nodes.map((node) => {
      if(node.timestamp){
        let date = node.timestamp.split(" ")[0].split("-");
        date = date[2] + "/" + date[1] + "/" + date[0];
        let time = node.timestamp.split(" ")[1];
        if (this.props.state.defaultNodeTypes.includes(node.type)) {
          node.text = wrapContextTextToArray(node.text);
        } else {
          node.text = wrapNonContextTextToArray(node.text);
        }
        node.time = time;
        node.date = date;
      }
      return node;
    });
    
    return nodes;
  }
  
  updateScheduler() {
    setInterval(() => { this.checkUpdate(); }, this.props.state.updateInterval);
  }
  
  checkUpdate() {
    //get all data 
    this.props.dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
      if(result[0].data.length == 0){ //stops empty database autoupdate complaints
        return;
      }
      let newHash = hash(result, { algorithm: 'md5' });
      if (newHash !== this.state.currentHash) {
        //Autoupdate if enabled - or prompt user
        if (this.props.state.updateAuto) {
          console.log("Update taking place.."); // eslint-disable-line
          this.componentWillMount();
        } else {
          console.log("There is a new update available"); // eslint-disable-line
          this.props.dispatch(SET("updateAvailable", true));
        }
      }
    });
  }
  
  //from Neo4j http response
  convertNeo4jResult(result) {
    return result[0].data.map((item) => { return item.row[0]; });
  }
  
  initPaper() {
    let paper = document.getElementById('paper');
    paper.width = (window.innerWidth);
    paper.height = (window.innerHeight);
  }
  
  render() {
    console.log("PROPS Updated: ", JSON.parse(JSON.stringify(this.props))); // eslint-disable-line
    return (
      <Paper className="paper" id="paper" ref="paper">
      <InteractionEvents 
        loadDatabase={(dataFile)=>this.loadDatabase(dataFile)}/>
      </Paper>
    );
  }
}


export default HomePage;
