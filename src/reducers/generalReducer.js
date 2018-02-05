
const initialState = {
    databaseError : "#FFFFF",
    nodes:[],
    links:[],
    mainMenu:[],
    elementMenu:[],
    treeData:[],
    layout:"TREE",
    layoutReady: false,
    defaultNodeTypes: ["I","L"],
    updateInterval: 15000,
    autoUpdate: false,
    updateAvailable: false,
    lastUpdated: null,
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
          //console.log("updating.." , action.variable , " to.. " , action.payload);
          state[action.variable].push(action.payload);
          return {
              ...state,
          };
    }
  }
  return state;
}
