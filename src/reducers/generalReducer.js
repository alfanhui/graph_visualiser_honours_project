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
  creationHaltRefresh: false,
  nodeTypes:[
    {type:"I", name:"Information Node"},
    {type:"LA", name:"Locution Node"},
  ],
  edgeTypes:[
    {type:"RA", name:"Default Inference"},
    {type:"CA", name:"Default Conflict"},
    {type:"TA", name:"Default Transition"},
    {type:"MA", name:"Default Rephrase"},
    {type:"PA", name:"Default Preference"},
  ],
  edgeTypesTEST:{
    "DAD":"FATHER TO",
    "MUM":"MOTHER TO",
    "BROTHER":"BROTHER TO",
    "SISTER":"SISTER TO",
    "AUNT":"AUNT TO",
    "UNCLE":"UNCLE TO",
    "SON":"SON TO",
    "DAUGHTER":"DAUGHTER TO",
  },
  currentDataFile:'11130',
  dataFiles:[
    //"11257", //looper
    "11166",
    //"11161", //looper
    //"11157", //looper (possibleDepth)
    "11130",
    "11118",
    "11116",
    "11108",
    //"10852", //too big
    //"10701", //too wide
    "10612",
    "CLEAR"]
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
