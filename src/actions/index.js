import * as types from "../constants/actionTypes";

export function setThing(variable, payload) {
  console.log("Actions:", variable, payload)
  return {
    type: "SET_THING",
    variable: variable,
    payload: payload
  };
}
