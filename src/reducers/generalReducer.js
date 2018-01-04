
const initialState = {
    databaseError : "#FFFFF",
    nodes:[],
    links:[]
  };


export default function reducer(state = initialState, action) {
  switch(action.type){
    case "SET":{
          console.log("setting.." , action.variable , " to.. " , action.payload);
          return {
              ...state,
              [action.variable]: action.payload,
          };
    }
  }
  return state;
}
