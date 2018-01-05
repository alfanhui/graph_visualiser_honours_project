import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';
import {postQuery} from 'api/dbConnection';
import {SET} from 'actions';
import ForceDirected from './ForceDirected';
import {importJSON} from 'utilities/JsonIO';

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
    //Grab data
    this.props.dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
      this.props.dispatch(SET('nodes', this.convertNeo4jResult(result)));
    });
    this.props.dispatch(postQuery('START r=rel(*) RETURN r')).then((result)=>{
      this.props.dispatch(SET('links', this.convertNeo4jResult(result)));
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
      <ForceDirected/>
      </Paper>
    );
  }
}

{/*<DatabaseOptions/>*/} //a button to load database

export default HomePage;
