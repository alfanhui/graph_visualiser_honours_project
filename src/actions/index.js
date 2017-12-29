import * as types from "constants/actionTypes"; //this does not work..

//any of these functions needs to be called via this.props.dispatch(<function name>)

export function SET(variable, payload) {
  return {
    type: "SET",
    variable: variable,
    payload: payload
  };
}
