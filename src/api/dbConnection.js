import request from 'superagent';
import {SET} from 'reducerActions';
/*Code in file written by Stephen Wright from Stackoverflow on 12th of Mar 2014 at 23:00, see config.js */
let env = process.env.NODE_ENV || 'development';
let config = require('../config')[env];
/******* */
let url = config.localhost + config.port + config.transaction ; //subject to change after check

export function checkAddress() {
    return () => {
        return request.post(url)
            .auth(config.login.username, config.login.password)
            .then((res) => {
                if (res.ok) {
                    console.log("LOCALHOST AVALIABLE"); // eslint-disable-line
                    //run localhost, no change needed
                }
            })
            .catch(() => {
                console.log("SWITCHED TO REMOTEHOST"); // eslint-disable-line
                url = config.remotehost + config.port + config.transaction;
                //run host address instead
            });
    };
}

export function postQuery(statements, parameters = null) {
  if(!(statements.constructor === Array)){
    statements = [statements];
  }
  let preparedStatement = [];
  statements.map((s) => {
    preparedStatement.push({statement: s, parameters: parameters});
  });
  return (dispatch) => {
      return request.post(url)
      .send({ statements: preparedStatement })
      .auth(config.login.username,config.login.password)
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
        console.log("This error: " , err, "statement:", preparedStatement); // eslint-disable-line
        dispatch(SET("databaseError", '#F50057'));
      });
  };
}

//Async but notice the return of request.. this makes it promised before other async actions happen.
export function wipeDatabase() {
  return (dispatch) => {
      return request.post(url)
    .send({ statements: [{ statement: 'MATCH (n) OPTIONAL MATCH (n) - [r] - () DELETE n, r'}] })
    .auth(config.login.username,config.login.password)
    .then(()=> {
      dispatch(SET("nodes", []));
      dispatch(SET("links", []));
      console.log("Database wiped"); // eslint-disable-line
    })
    .catch((err)=> {
      console.log("This error: " , err); // eslint-disable-line
    });
  };
}

export function removeIndexes() {
  return (dispatch) => {
      return request.post(url)
    .send({ statements: [{ statement: 'CALL db.indexes()'}] })
    .auth(config.login.username,config.login.password)
    .then((res)=> {
      let data = res.body.results[0].data;
      data.map((item) => {
        dispatch(postQuery(["DROP " + item.row[0]], null));
      });
    })
    .catch((err)=> {
      console.log("This error: " , err); // eslint-disable-line
    });
  };
}
