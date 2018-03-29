const initialState = {
  averagedScale: 1,
  connectionType: "",
  creationHaltRefresh: false,
  currentDataFile: '11130',
  currentHash: "",
  databaseError: "#FFFFF",
  dataFiles:[
    "11257",
    "11166",
    "11130",
    "11118",
    "11116",
    "11108",
    "10612",
    "CLEAR"],
  defaultNodeTypes: ["I", "L"],
  highlightedNodes:[],
  highlightedEdges:[],
  lastUpdated: null,
  layout: "TREE",
  layoutReady: false,
  links: [],
  loading:false,
  menuElementArray: [],
  menuMainArray: [],
  newLinks: [],
  nodes: [],
  nodeTypes:[
    {type:"I", name:"Information Node"},
    {type:"LA", name:"Locution Node"},
    {type:"RA", name:"Default Inference", scheme:"Default Inference", schemeID:"72"},
    {type:"CA", name:"Default Conflict", scheme:"Default Conflict", schemeID:"71"},
    {type:"TA", name:"Default Transition", scheme:"Default Transition", schemeID:"82"},
    {type:"MA", name:"Default Rephrase", scheme:"Default Rephrase", schemeID:"144"},
    {type:"PA", name:"Default Preference", scheme:"Default Preference", schemeID:"161"},
    {type:"YA", name: "Restating", scheme:"Restating", schemeID:"101"},
    {type:"YA", name: "Disagreeing", scheme:"Disagreeing", schemeID:"78"},
    {type:"YA", name: "Arguing", scheme:"Arguing", schemeID:"80"}
  ],
  paint:false,
  testMode: true,
  updateFromCreate: true,
  updateInterval: 15000,
  updateAuto: false,
  updateAvailable: false,
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
      //console.log("replacing.." , action.variable , " to.. " , action.payload, " by..", action.id);
      let newState = state[action.variable].filter(obj => obj[action.id] !== action.payload[action.id]);
      newState.push(action.payload);
      return {
        ...state,
        [action.variable]: newState,
      };
    }
    case "DROP": {
      //console.log("Dropping.." , action.variable , " to.. " , action.payload, " by..", action.id);
      let newState = state[action.variable].filter(obj => obj[action.id] !== action.payload[action.id]);
      return {
        ...state,
        [action.variable]: newState,
      };
    }
  }
  return state;
}
