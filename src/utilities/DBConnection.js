import request from 'superagent';
import { SET } from 'reducerActions';
import hash from 'object-hash';
import config from '../config';
let url = config.localhost + config.port + config.transaction;


export function checkAddress() {
  return (dispatch) => {
    return request.post(url)
    .auth(config.u, config.p)
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

  let preparedStatements = [];
  statements.map((s, index) => {
    if(parameters == null || parameters.length != statements.length){
      preparedStatements.push({statement: s, parameters: parameters});
    }else{
      preparedStatements.push({statement: s, parameters: parameters[index]});
    }
  });
  return (dispatch) => {
    return request.post(url)
    .send({ statements: preparedStatements })
    .auth(config.u,config.p)
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
      console.log("This error occcured: ", err, "statement:", preparedStatements); // eslint-disable-line
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
    .auth(config.u,config.p)
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
    .auth(config.u,config.p)
    .then((res)=> {
      if(res.ok){
        if(res.body.errors.length >0){
          throw res.body.errors;
        }else if (res.body.results.length > 0){
          let data = res.body.results[0].data;
          let dropStatement = [];
          data.map((item) => {
            dropStatement.push("DROP " + item.row[0]);
          });
          dispatch(SET("databaseError", '#FFFFF'));
          return dispatch(postQuery(dropStatement));
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
