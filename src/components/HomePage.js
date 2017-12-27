import React from 'react';
import { connect } from "react-redux";
import SomeThing from './SomeThing';
//import SomeThingSetter from './SomeThingSetter';
//import { PostQuery } from 'api/dbConnection';
//import { loadJSON, graphMLtoCypher } from 'utilities/graphML';
import Paper from 'material-ui/Paper';
import DatabaseOptions from './DatabaseOptions';

@connect((store) => {
  return {
      state: store.generalReducer
  };
})





class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentWillMount() {
        //this.wipeDataBase();
    }

    componentDidUpdate() {

    }

    componentWillUnmount(){

    }
/*
    wipeDataBase() {
        console.log("Wiping  database..");
        PostQuery(['MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'], null, "Wiping Database");
        console.log("Testing JSON import..");
        loadJSON(function (response) {
            // Parse JSON string into object
            let actual_JSON = JSON.parse(response);
            console.log(actual_JSON);
            graphMLtoCypher(actual_JSON);
        });
    }
*/

    render(){
        return (
          <Paper> //main paper
            <div className={"main"}>
              <div className={'h2'}> REACT </div>
              <DatabaseOptions value={1}/>
            </div>
          </Paper>
      );
    }

}

export default HomePage;
