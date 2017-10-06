import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {setThing} from '../actions/index';

@connect((store) => {
  return {
      state: store.generalReducer
  };
})

class SomeThingSetter extends React.Component{

  constructor(props) {
    super(props);
    console.log("SomeThingSetter", this.props)
  }

  render(){
    return (
      <button onClick={() => {
        const thing = window.prompt(`What should thing be?`);
        this.props.dispatch(setThing(("thing" + this.props.thingId), thing));
      }}>
        Click me to set thing.
      </button>
    );
  }
}

export default SomeThingSetter;
