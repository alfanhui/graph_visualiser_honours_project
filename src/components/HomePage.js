import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';
import {postQuery, checkAddress} from 'api/dbConnection';
import {SET} from 'reducerActions';
import ForceDirected from './Layout_ForceDirected';
import Tree from './Layout_Tree';
import {importJSON} from 'utilities/JsonIO';
import InteractionEvents from './InteractionEvents';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

//console.log(JSON.parse(JSON.stringify(err)));

class HomePage extends React.Component{

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    
    this.props.dispatch(checkAddress()).then(() => {
        //Grab data
        this.props.dispatch(postQuery('MATCH (n) where not n:L RETURN n')).then((result) => { //nodes
          this.props.dispatch(SET('nodes', this.convertNeo4jResult(result))); //for forceDirected
        });
        this.props.dispatch(postQuery('START r=rel(*) WHERE NOT ((:L)-[r]->()) AND NOT (()-[r]->(:L)) RETURN r')).then((result) => { //edges
          this.props.dispatch(SET('links', this.convertNeo4jResult(result))); //for forceDirected
        });     
    });
  }

  //from Neo4j http response
  convertNeo4jResult(result){
    return result[0].data.map((item) =>{ return item.row[0];});
  }

  componentDidMount(){
    this.initPaper();
    //load data into nodes and links props.
  }

  componentDidUpdate() {

  }

  componentWillUnmount(){

  }

  initPaper(){
    let paper = document.getElementById('paper');
    paper.width  = (window.innerWidth);
    paper.height = (window.innerHeight);
  }

  render(){
    console.log("PROPS Updated: " , JSON.parse(JSON.stringify(this.props)));
    return (
      <Paper className="paper" id="paper" ref="paper">
        <InteractionEvents/>
      </Paper>
    );
  }
}

{/*<DatabaseOptions/>*/} //a button to load database

export default HomePage;
