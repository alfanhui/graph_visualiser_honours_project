import { wipeDatabase, removeIndexes, postQuery, updateHash} from 'utilities/DBConnection'; //
import request from 'superagent';
import {SET} from 'reducerActions';
import _ from 'lodash'; 

//Import json from local file. Await for database to be wiped via promise before continuing..
export function importJSON(dataFile) {
  let fileName = 'nodeset'+ dataFile;
  return (dispatch) => {
    dispatch(SET('databaseError', "#FFFFFF"));
    return dispatch(wipeDatabase()).then(function(){
      return dispatch(removeIndexes()).then(function(){ //remove indexes
        return request.get("data/US2016G1/" + fileName + ".json")
        .then((res)=> {
          dispatch(SET("currentDataFile", dataFile));
          console.log(res.body); // eslint-disable-line
          let {nodeStatements, dictionary, edgeStatements} = graphMLtoCypher(res.body);
          if(nodeStatements.length == 0) return;
          return dispatch(compileQuery(nodeStatements, dictionary, edgeStatements));
        })
        .catch((err)=> {
          console.log("This error: " , err); // eslint-disable-line
          dispatch(SET("databaseError", "#F50057"));
        });
      });
    });
  };
}

export function test(){
  return wipeDatabase();// return (dispatch) => {
  //   return dispatch(wipeDatabase());
  // }
}

//post dispatches
function compileQuery(nodeStatements, dictionary, edgeStatements){
  return (dispatch) => {
    //send off queries, as promises, because you cannot create edges from nodes that don't already exist
    return dispatch(postQuery(nodeStatements, dictionary)).then(function(){
      for (let nodeType in dictionary) {
        dispatch(postQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null)); //create index
      }
      
    }).then(function(){
      return dispatch(postQuery(edgeStatements, null));
    });
  };
}


//handle json object ready for cypher conversion
function graphMLtoCypher(jsonObj) {
  let edgeStatements = [];
  
  let {nodeStatements, dictionary, hashMap} = nodeToCypher(jsonObj);
  if(nodeStatements.length > 0){
    //create edges
    if(jsonObj.hasOwnProperty('edges')){
      let edgeParameters = { "edges": jsonObj.edges };
      edgeParameters && edgeParameters.edges.map((item) => {
        if(hashMap.hasOwnProperty(item.toID) && hashMap.hasOwnProperty(item.fromID)){
          item["toType"] = hashMap[item.toID].type;
          item["fromType"] = hashMap[item.fromID].type;
        }
      });
      edgeStatements = edgeToCypher(edgeParameters);
    }  
  }
  //locutions?
  return {nodeStatements, dictionary, edgeStatements};
}

//handle json object ready for cypher conversion
function nodeToCypher(jsonObj) {
  let nodeStatements = [],
      dictionary = {},
      hashMap = {};
  if(jsonObj.hasOwnProperty('nodes')){
    let nodeParameters = { "props": jsonObj.nodes };
    //Sort by type
    
    if(nodeParameters.props.length < 1){
      return {nodeStatements, dictionary, hashMap};
    }
    nodeParameters.props.map((item) => {
      if(item.hasOwnProperty('type')){
        if (!dictionary[item.type]) {
          dictionary[item.type] = [item];
        } else {
          dictionary[item.type].push(item);
        }
        hashMap[item.nodeID] = item; //aid in creating edges
      }
    });
    //create nodes
    for (let nodeType in dictionary) {
      nodeStatements.push('UNWIND {' + nodeType + '} AS map CREATE (n:' + nodeType + ') SET n = map');
    }
  }
  return {nodeStatements, dictionary, hashMap};
}

//handle json object ready for cypher conversion
function edgeToCypher(jsonObj) {
  //createEdgeStatements
  let edgeStatements = [];
  jsonObj.edges.map((edge) => {
    edgeStatements.push('MATCH (n:' + edge.fromType + '),(m:' + edge.toType +
    ') WHERE n.nodeID=\'' + edge.fromID + '\' AND m.nodeID=\'' + edge.toID +
    '\' CREATE (n)-[r:LINK{edgeID:\'' + edge.edgeID +
    '\', source: \'' + edge.fromID +
    '\', target: \'' + edge.toID +
    '\', formEdgeID: \'' + edge.formEdgeID + '\'}]->(m)');
  });
  return edgeStatements;
}


export function updateNode(oldNode, amendedNode) {
    let newNode = _.cloneDeep(amendedNode);
    return (dispatch) => {
        return dispatch(removeNode(oldNode)).then(() => {
            return dispatch(importNode(newNode)).then(() => {
                dispatch(updateHash());
            });
        });
    };
}

export function importNode(_newNode){
  let newNode = _.cloneDeep(_newNode);
  newNode.text = newNode.text.join("");
  return (dispatch) => {
    let {nodeStatements, dictionary} = nodeToCypher({nodes:[newNode]});
    return dispatch(postQuery(nodeStatements, dictionary)).then(function(){
      for (let nodeType in dictionary) {
        dispatch(postQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null));
      }
    }).then(() => {
        dispatch(updateHash());
    });
  };
}

export function importEdge(_newEdge){
  let newEdge = _.cloneDeep(_newEdge);
  return (dispatch) => {
    let edgeStatements = edgeToCypher({edges:[newEdge]});
    return dispatch(postQuery(edgeStatements)).then(() => {
        dispatch(updateHash());
    });
  };
}

export function removeNode(nodeToRemove){
  return(dispatch) => {
      return dispatch(postQuery("MATCH (n:" + nodeToRemove.type + ") WHERE n.nodeID=\'" + nodeToRemove.nodeID + "\' DELETE n")).then(() => {// eslint-disable-line
          dispatch(updateHash());
      });
  };
}

export function removeEdges(edgesToRemove){
  if(!Array.isArray(edgesToRemove)){
    edgesToRemove = [edgesToRemove];
  }
  let removeStatements = edgesToRemove.map((edge)=>{
    return "MATCH (n)-[rel:LINK]->(r) WHERE n.nodeID=\'" + edge.source + "\' AND r.nodeID=\'" + edge.target + "\' DELETE rel";// eslint-disable-line
  });
  return(dispatch) => {
      return dispatch(postQuery(removeStatements)).then(() => {
          dispatch(updateHash());
      }); 
  };
}

