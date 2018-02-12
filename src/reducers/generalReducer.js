import _ from 'lodash';

const initialState = {
  databaseError: "#FFFFF",
  nodes: [],
  links: [],
  mainMenu: [],
  elementMenu: [],
  treeData: [],
  layout: "TREE",
  layoutReady: false,
  defaultNodeTypes: ["I", "L"],
  updateInterval: 15000,
  autoUpdate: false,
  updateAvailable: false,
  lastUpdated: null,
  averagedScale: 1,
  edgeTypes:{
    "RA":"Default Inference",
    "CA":"Default Conflict",
    "TA":"Default Transition",
    "MA":"Default Rephrase",
    "PA":"Default Preference",
  },
  edgeTypesTEST:{
    "DAD":"FATHER TO",
    "MUM":"MOTHER TO",
    "BROTHER":"BROTHER TO",
    "SISTER":"SISTER TO",
    "AUNT":"AUNT TO",
    "UNCLE":"UNCLE TO",
    "SON":"SON TO",
    "DAUGHTER":"DAUGHTER TO",
  }
};


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET": {
      //console.log("setting.." , action.variable , " to.. " , action.payload);
      return {
        ...state,
        [action.variable]: action.payload,
      };
    }
    case "UPDATE": {
      //console.log("updating.." , action.variable , " to.. " , action.payload);
      state[action.variable].push(action.payload);
      return {
        ...state,
      };
    }
    case "REPLACE": {
      //console.log("updating.." , action.variable , " to.. " , action.payload);
      let newState = state[action.variable].filter(obj => obj[action.id] !== action.payload[action.id]);
      newState.push(action.payload);
      return {
        ...state,
        [action.variable]: newState,
      };
    }
    case "DROP": {
      //console.log("updating.." , action.variable , " to.. " , action.payload);
      let newState = state[action.variable].filter(obj => obj[action.id] !== action.payload);
      return {
        ...state,
        [action.variable]: newState,
      };
    }
  }
  return state;
}
