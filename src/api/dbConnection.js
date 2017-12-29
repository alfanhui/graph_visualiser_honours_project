import request from 'superagent';
import { httpUrlForTransaction } from 'constants/globalVar';
import {SET} from 'actions';
let username = 'neo4j';
let password = 'jazzyrice80';

export function postQuery(statements, parameters, operationText) {
  let preparedStatement = [];
  statements.map((s) => {
    preparedStatement.push({statement: s, parameters: parameters})
  });
  return dispatch => {
      return request.post(httpUrlForTransaction)
      .send({ statements: preparedStatement }) //[{ statement: s, parameters: parameters }]
      .auth(username,password)
      .then((res)=> {
        if(res.ok){
          if(res.body.errors.length >0){
            throw res.body.errors;
          }else if (res.body.results.length > 0){
            console.log(res.body);
          }
        }
      })
      .catch((err)=> {
        console.log("This error: " , err);
        dispatch(SET("databaseError", '#F50057'));
      });
  }
}

//Async but notice the return of request.. this makes it promised before other async actions happen.
export function wipeDatabase() {
  return (dispatch) => {
    return request.post(httpUrlForTransaction)
    .send({ statements: [{ statement: 'MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'}] })
    .auth(username,password)
    .then((res)=> {
      console.log("Database wiped");
    })
    .catch((err)=> {
      console.log("This error: " , err);
    });
  }
}
