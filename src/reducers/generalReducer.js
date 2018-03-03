const initialState = {
  databaseError: "#FFFFF",
  nodes: [],
  links: [],
  menuMainArray: [],
  menuElementArray: [],
  treeData: [],
  layout: "TREE",
  layoutReady: false,
  defaultNodeTypes: ["I", "L"],
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
    "11257", //looper
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
