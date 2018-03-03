import request from 'superagent';
import {SET} from 'reducerActions';
import configFile from 'config';
/*Code in file written by Stephen Wright from Stackoverflow on 12th of Mar 2014 at 23:00, see config.js */
let env = process.env.NODE_ENV || 'development';
let config = configFile[env];
let url;
/*******/

export function checkAddress() {
  url = config.localhost + config.port + config.transaction;
  return (dispatch) => {
    return request.post(url)
    .auth(config.login.username, config.login.password)
    .then((res) => {
      if (res.ok) {
        dispatch(SET("databaseError", '#FFFFF'));
        dispatch(SET("connectionType", 'local'));
        console.log("LOCALHOST AVALIABLE"); // eslint-disable-line
        //run localhost, no change needed
      }
    })
    .catch(() => {
      url = config.remotehost + config.port + config.transaction;
      dispatch(SET("databaseError", '#FFFFF'));
      dispatch(SET("connectionType", 'remote'));
      console.log("SWITCHED TO REMOTEHOST"); // eslint-disable-line
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
          dispatch(SET("databaseError", '#FFFFF'));
          return(res.body.results);
        }
      }
    })
    .catch((err)=> {
      console.log("This error occcured: " , err, "statement:", preparedStatement); // eslint-disable-line
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
      dispatch(SET("databaseError", '#FFFFF'));
      console.log("Database wiped"); // eslint-disable-line
    }).then(()=>{
      return dispatch(removeIndexes());
    }).catch((err)=> {
      console.log("This error occcured: " , err); // eslint-disable-line
      dispatch(SET("databaseError", '#F50057'));
    });
  };
}

export function removeIndexes() {
  return (dispatch) => {
    return request.post(url)
    .send({ statements: [{ statement: 'CALL db.indexes()'}] })
    .auth(config.login.username,config.login.password)
    .then((res)=> {
      if(res.ok){
        if(res.body.errors.length >0){
          throw res.body.errors;
        }else if (res.body.results.length > 0){
          let data = res.body.results[0].data;
          data.map((item) => {
            dispatch(SET("databaseError", '#FFFFF'));
            dispatch(postQuery(["DROP " + item.row[0]], null));
          });
        }
      }
    })
    .catch((err)=> {
      console.log("This error occcured: " , err); // eslint-disable-line
      dispatch(SET("databaseError", '#F50057'));
    });
  };
}
