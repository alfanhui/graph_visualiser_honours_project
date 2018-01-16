import { postQuery, wipeDatabase, removeIndexes} from 'api/dbConnection';
import request from 'superagent';
import {SET} from 'reducerActions';

//Import json from local file. Await for database to be wiped via promise before continuing..
export function importJSON() {
  return dispatch => {
    dispatch(SET('databaseError', "#FFFFFF"));
    dispatch(wipeDatabase()).then(function(){
      dispatch(removeIndexes()); //remove indexes
    }).then(function(){
      request.get("data/1238.json")
      .then((res)=> {
        console.log(res.body);
        dispatch(graphMLtoCypher(res.body));
      })
      .catch((err)=> {
        console.log("This error: " , err);
        dispatch(SET("databaseError", "#F50057"));
      });
    });
  };
}

//handle json object ready for cypher conversion
function graphMLtoCypher(jsonObj) {
  return dispatch => {
    let nodeParameters = { "props": jsonObj.nodes };
    //Sort by type
    let dictionary = {};
    let hashMap = {};
    if(nodeParameters.props.length < 1){
      console.log("Nothing to import");
      return;
    }
    nodeParameters.props.map((item) => {
      if (!dictionary[item.type]) {
        dictionary[item.type] = [item];
      } else {
        dictionary[item.type].push(item);
      }
      hashMap[item.nodeID] = item; //aid in creating edges
    });

    //create nodes
    let nodeStatements = [];
    for (let nodeType in dictionary) {
      nodeStatements.push('UNWIND {' + nodeType + '} AS map CREATE (n:' + nodeType + ') SET n = map');
    }

    //create edges
    let edgeParameters = { "rows": jsonObj.edges };
    edgeParameters && edgeParameters.rows.map((item) => {
      item["toType"] = hashMap[item.toID].type;
      item["fromType"] = hashMap[item.fromID].type;
    });
    let edgeStatements = [];
    edgeParameters && edgeParameters.rows.map((edge) => {
      edgeStatements.push('MATCH (n:' + edge.fromType + '),(m:' + edge.toType +
                          ') WHERE n.nodeID=\'' + edge.fromID + '\' AND m.nodeID=\'' + edge.toID +
                          '\' CREATE (n)-[r:LINK{edgeID:\'' + edge.edgeID +
                                            '\', source: \'' + edge.fromID +
                                            '\', target: \'' + edge.toID +
                                            '\', formEdgeID: \'' + edge.formEdgeID + '\'}]->(m)');
    });

    //locutions?


    //console.log(nodeStatements, dictionary, edgeStatements);
    dispatch(compileQuery(nodeStatements, dictionary, edgeStatements));
  };
}


//post dispatches
function compileQuery(nodeStatements, dictionary, edgeStatements){
  return dispatch => {
    //send off queries, as promises, because you cannot create edges from nodes that don't already exist
    dispatch(postQuery(nodeStatements, dictionary)).then(function(){
      for (let nodeType in dictionary) {
        dispatch(postQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null)); //create index
      }

    }).then(function(){
      dispatch(postQuery(edgeStatements, null));
    });
  };
}
