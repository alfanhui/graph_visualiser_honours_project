import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';
import { postQuery, checkAddress } from 'api/dbConnection';
import { SET } from 'reducerActions';
import { importJSON } from 'utilities/JsonIO';
import { convertRawToTree } from 'utilities/DataToTree';
import InteractionEvents from './InteractionEvents';


@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class HomePage extends React.Component {

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
      //this.props.dispatch(importJSON()).then(() => {

        //Grab nodes from database  'MATCH (n) where not n:L RETURN n'
        this.props.dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
          nodes = this.convertNeo4jResult(result);
          this.props.dispatch(SET('nodes', nodes));
          //Grab edges   'START r=rel(*) WHERE NOT ((:L)-[r]->()) AND NOT (()-[r]->(:L)) RETURN r'
          this.props.dispatch(postQuery('START r=rel(*) RETURN r')).then((result) => {
            links = this.convertNeo4jResult(result);
            this.props.dispatch(SET('links', links));
          }).then(() => {
              if (this.props.state.layout == "TREE") {
                this.props.dispatch(convertRawToTree({ "nodes": nodes, "links": links }));
              };
          });
          });
        //});
      });
  }

  //from Neo4j http response
  convertNeo4jResult(result) {
    return result[0].data.map((item) => { return item.row[0]; });
  }

  componentDidMount() {
    this.initPaper();
    //load data into nodes and links props.
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

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
