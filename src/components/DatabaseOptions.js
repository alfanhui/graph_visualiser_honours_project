import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { postQuery, wipeDatabase} from 'api/dbConnection';
import {SET} from 'actions';
import {importJSON} from 'utilities/JsonIO';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class DatabaseOptions extends React.Component{

  constructor(props) {
    super(props);
  }


  loadJson = () => {
    this.props.dispatch(SET('databaseError', '#FFFFFF'));
    //wipeDatabase();
    this.props.dispatch(importJSON());
  }

  render(){
    return (
      <button
      onClick={() => {this.loadJson();}}>
      LOAD JSON
      </button>
    );
  }
}

export default DatabaseOptions;
