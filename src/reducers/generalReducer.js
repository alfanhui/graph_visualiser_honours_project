
const initialState = {
  thing0: "nothing",
  thing1: "nothing",
  thing2: "nothing",
}


export default function reducer(state = initialState, action) {
  switch(action.type){
    case "SET_THING":{
      return {
        ...state,
        [action.variable]: action.payload,
      }
    }
  }
  return state;
}
