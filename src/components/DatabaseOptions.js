import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {importJSON} from 'utilities/JsonIO';
import {FlatButton} from 'material-ui';

@connect((store) => {
  return {
    state: store.generalReducer
  };
})

class DatabaseOptions extends React.Component{

  static propTypes = {
    dispatch: PropTypes.func,
    state: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <FlatButton
        backgroundColor={this.props.state.databaseError}
        onClick={() => this.props.dispatch(importJSON())}>
        LOAD JSON
      </FlatButton>
    );
  }
}

export default DatabaseOptions;
