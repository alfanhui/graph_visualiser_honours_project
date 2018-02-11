//import * as types from "constants/reducerActionTypes"; //this does not work..

//any of these functions needs to be called via this.props.dispatch(<function name>)

export function SET(variable, payload) {
  return {
    type: "SET",
    variable: variable,
    payload: payload
  };
}

export function UPDATE(variable, payload) {
  return {
    type: "UPDATE",
    variable: variable,
    payload: payload
  };
}

export function REPLACE(variable, id, payload) {
  return {
    type: "REPLACE",
    variable: variable,
    id:id,
    payload: payload
  };
}

export function DROP(variable, id, payload) {
  return {
    type: "DROP",
    variable: variable,
    id:id,
    payload: payload
  };
}
