import request from 'superagent';
import { localhost_httpUrlForTransaction, remotehost_httpUrlForTransaction } from 'constants/globalVar';
import {SET} from 'reducerActions';
let username = 'neo4j';
let password = 'jazzyrice80';
let url = localhost_httpUrlForTransaction; //subject to change after check

export function checkAddress() {
    return dispatch => {
        return request.get(url)
            .auth(username, password)
            .then((res) => {
                if (res.ok) {
                    console.log("LOCALHOST AVALIABLE");
                    //run localhost, no change needed
                }
            })
            .catch((err) => {
                console.log("SWITCHED TO REMOTEHOST");
                url = remotehost_httpUrlForTransaction;
                //run host address instead
            });
    };
}

export function postQuery(statements, parameters) {
  if(!(statements.constructor === Array)){
    statements = [statements];
  }
  let preparedStatement = [];
  statements.map((s) => {
    preparedStatement.push({statement: s, parameters: parameters});
  });
  return dispatch => {
      return request.post(url)
      .send({ statements: preparedStatement }) //[{ statement: s, parameters: parameters }]
      .auth(username,password)
      .then((res)=> {
        if(res.ok){
          if(res.body.errors.length >0){
            throw res.body.errors;
          }else if (res.body.results.length > 0){
            return(res.body.results);
          }
        }
      })
      .catch((err)=> {
        console.log("This error: " , err);
        dispatch(SET("databaseError", '#F50057'));
      });
  };
}

//Async but notice the return of request.. this makes it promised before other async actions happen.
export function wipeDatabase() {
  return (dispatch) => {
      return request.post(url)
    .send({ statements: [{ statement: 'MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'}] })
    .auth(username,password)
    .then((res)=> {
      console.log("Database wiped");
    })
    .catch((err)=> {
      console.log("This error: " , err);
    });
  };
}

export function removeIndexes() {
  return (dispatch) => {
      return request.post(url)
    .send({ statements: [{ statement: 'CALL db.indexes()'}] })
    .auth(username,password)
    .then((res)=> {
      let data = res.body.results[0].data;
      data.map((item) => {
        dispatch(postQuery(["DROP " + item.row[0]], null));
      });
    })
    .catch((err)=> {
      console.log("This error: " , err);
    });
  };
}
