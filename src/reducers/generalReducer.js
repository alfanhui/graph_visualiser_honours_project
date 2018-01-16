
const initialState = {
    databaseError : "#FFFFF",
    nodes:[],
    links:[],
    mainMenu:[],
    elementMenu:[]
  };


export default function reducer(state = initialState, action) {
  switch(action.type){
    case "SET":{
          //console.log("setting.." , action.variable , " to.. " , action.payload);
          return {
              ...state,
              [action.variable]: action.payload,
          };
    }
    case "UPDATE":{
          //console.log("setting.." , action.variable , " to.. " , action.payload);
          let appendedProperty = state[action.variable].push(action.payload);
          console.log(action.payload);
          return {
              ...state,
              [action.variable]: appendedProperty,
          };
    }
  }
  return state;
}
