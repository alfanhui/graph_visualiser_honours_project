const initialState = {
  databaseError: "#FFFFF",
  nodes: [],
  links: [],
  menuMainArray: [],
  menuElementArray: [],
  layout: "TREE",
  layoutReady: false,
  defaultNodeTypes: ["I", "L"],
  //defaultNodeTypes: ["A"], //TEST PURPOSES
  connectionType: "",
  updateInterval: 15000,
  updateFromCreate: false,
  updateAuto: false,
  updateAvailable: false,
  lastUpdated: null,
  paint:false,
  loading:false,
  averagedScale: 1,
  creationHaltRefresh: false,
  highlightedNodes:[],
  highlightedEdges:[],
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
  // nodeTypes:[ //TEST
  //   {type:"A", name:"Person"},
  //   {type:"B", name:"Married", scheme:"Default Inference", schemeID:"72"},
  //   {type:"C", name:"Sibling", scheme:"Default Conflict", schemeID:"71"},
  //   {type:"D", name:"Father/Son", scheme:"Default Transition", schemeID:"82"},
  //   {type:"E", name:"Father/Daughter", scheme:"Default Rephrase", schemeID:"144"},
  //   {type:"F", name:"Mother/Son", scheme:"Default Preference", schemeID:"161"},
  //   {type:"G", name: "Mother/Daughter", scheme:"Restating", schemeID:"101"},
  //   {type:"H", name: "Relationship", scheme:"Disagreeing", schemeID:"78"},
  //   {type:"I", name: "Friendship", scheme:"Arguing", schemeID:"80"}
  // ],
  currentDataFile:'11130',
  dataFiles:[
    "11257",
    "11166",
    "11130",
    "11118",
    "11116",
    "11108",
    "10612",
    "CLEAR"],
    // dataFiles:[ //TEST
    //   "TEST_1",
    //   "TEST_2",
    //   "CLEAR"]
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
