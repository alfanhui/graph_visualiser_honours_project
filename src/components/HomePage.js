import React from 'react';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';
import {postQuery, checkAddress} from 'api/dbConnection';
import {SET} from 'reducerActions';
import {importJSON} from 'utilities/JsonIO';
import {convertRawToTree} from 'utilities/DataToTree';
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
        //Grab nodes
        this.props.dispatch(postQuery('MATCH (n) where not n:L RETURN n'))
        .then((result) => {
          this.props.dispatch(SET('nodes', this.convertNeo4jResult(result))); //for forceDirected
        });

        //Grab edges
        this.props.dispatch(postQuery('START r=rel(*) WHERE NOT ((:L)-[r]->()) AND NOT (()-[r]->(:L)) RETURN r'))
        .then((result) => { 
          this.props.dispatch(SET('links', this.convertNeo4jResult(result))); //for forceDirected
        }).then(()=> {
          if(this.props.state.layout == "TREE"){
            this.props.dispatch(convertRawToTree({"nodes":this.props.state.nodes, "links":this.props.state.links}));
          }
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
        {<DatabaseOptions/>} 
        <InteractionEvents/>
      </Paper>
    );
  }
}



export default HomePage;
