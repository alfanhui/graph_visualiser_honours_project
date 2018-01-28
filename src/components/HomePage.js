import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { postQuery, checkAddress } from 'api/dbConnection';
import { SET } from 'reducerActions';
import { convertRawToTree } from 'utilities/DataToTree';
import InteractionEvents from './InteractionEvents';
import {textToWrappedArray} from 'utilities/WrapText';
import { importJSON } from 'utilities/JsonIO';
import DatabaseOptions from './DatabaseOptions';

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

    };
  }

  componentWillMount() {
    let nodes, links;
    //check the address of the database
    this.props.dispatch(checkAddress()).then(() => {

      //send data to database
      this.props.dispatch(importJSON()).then(() => {

      //Grab nodes from database  'MATCH (n) where not n:L RETURN n'
      this.props.dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
        nodes = this.convertNeo4jResult(result);
        //wordwrap
        nodes = nodes.map((node)=>{
          console.log(node.nodeID, node.text);
          node.text = textToWrappedArray(node.text);
          return node;
        });
        this.props.dispatch(SET('nodes', nodes));
        //Grab edges   'START r=rel(*) WHERE NOT ((:L)-[r]->()) AND NOT (()-[r]->(:L)) RETURN r'
        this.props.dispatch(postQuery('START r=rel(*) RETURN r')).then((result) => {
          links = this.convertNeo4jResult(result);
          this.props.dispatch(SET('links', links));
        }).then(() => {
          if (this.props.state.layout == "TREE") {
            this.props.dispatch(convertRawToTree({ "nodes": nodes, "links": links }));
          }
        });
      });
      });
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
    console.log("PROPS Updated: ", JSON.parse(JSON.stringify(this.props)));
    return (
      <Paper className="paper" id="paper" ref="paper">
        <InteractionEvents />
      </Paper>
    );
  }
}

{/*<DatabaseOptions/> //button to load database */ }

export default HomePage;
