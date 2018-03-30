import request from 'superagent';
import { SET } from 'reducerActions';
import hash from 'object-hash';
/*Code in file written by Stephen Wright from Stackoverflow on 12th of Mar 2014 at 23:00, see config.js */
const config = {
      port: ':7475',
      remotehost: 'http://10.201.84.137',
      localhost: 'http://localhost',
      transaction: '/db/data/transaction/commit',
      login:{
          username:'neo4j',
          password:'jazzyrice80'
      }
};
let url = config.localhost + config.port + config.transaction;
/*******/

export function checkAddress() {
  return (dispatch) => {
    return request.post(url)
    .auth(config.login.username, config.login.password)
    .then((res) => {
      if (res.ok) {
        dispatch(SET("databaseError", '#FFFFF'));
        dispatch(SET("connectionType", 'local'));
        //run localhost, no change needed
      }else{
        throw 'error';
      }
    })
    .catch(() => {
      url = config.remotehost + config.port + config.transaction;
      dispatch(SET("databaseError", '#FFFFF'));
      dispatch(SET("connectionType", 'remote'));
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
      } else {
          dispatch(SET("databaseError", '#F50057'));
          throw res.body.errors;
      }
    })
    .catch((err)=> {
      console.log("This error occcured: ", err, "statement:", preparedStatement); // eslint-disable-line
      dispatch(SET("databaseError", '#F50057'));
      return 0;
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
    }).then(()=>{
      return dispatch(removeIndexes());
    }).catch((err)=> {
      console.log("This error occcured: " , err); // eslint-disable-line
      dispatch(SET("nodes", []));
      dispatch(SET("links", []));
      dispatch(SET("databaseError", '#F50057'));
      return 0;
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
          return data.map((item) => {
            dispatch(SET("databaseError", '#FFFFF'));
            return dispatch(postQuery(["DROP " + item.row[0]], null));
          });
        }
      }
    }).catch((err)=> {
      console.log("This error occcured: " , err); // eslint-disable-line
      dispatch(SET("databaseError", '#F50057'));
      return 0;
    });
  };
}

export function updateHash() {
    return (dispatch) => {
        return dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
            let newHash = hash(result, { algorithm: 'md5' });
            return dispatch(SET("currentHash", newHash));
        });
    };
}


export function checkDatabase(currentHash) {
    return (dispatch) => {
        //get all data 
        return dispatch(postQuery('MATCH (n) RETURN n')).then((result) => {
            if (result[0].data.length == 0) { //stops empty database autoupdate complaints
                return;
            }
            let newHash = hash(result, { algorithm: 'md5' });
            if (newHash !== currentHash) {
                dispatch(SET("updateAvailable", true));
            }
        });
    };
}
