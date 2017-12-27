import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {setThing} from '../actions/index';
import { PostQuery } from 'api/dbConnection';
import { loadJSON, graphMLtoCypher } from 'utilities/graphML';

@connect((store) => {
  return {
      state: store.generalReducer
  };
})

class DatabaseOptions extends React.Component{

  constructor(props) {
    super(props);
  }


  loadJson(){
  }

  render(){
    console.log("value: " + this.props.value);
    return (
      <button onClick={() => {
        console.log("Wiping  database..");
        PostQuery(['MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'], null, "Wiping Database");
        console.log("Testing JSON import..");
        loadJSON(function (response) {
            // Parse JSON string into object
            let actual_JSON = JSON.parse(response);
            console.log(actual_JSON);
            graphMLtoCypher(actual_JSON);
        });
      }}>
        LOAD JSON
      </button>
    );
  }
}

export default DatabaseOptions;
