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
      //return dispatch(removeIndexes()).then(function(){ //remove indexes
      return request.get("data/US2016G1/" + fileName + ".json")
      .then((res)=> {
        if(!res || !res.hasOwnProperty('body')) throw "file not found"
        dispatch(SET("currentDataFile", dataFile));
        console.log(res.body); // eslint-disable-line
        let {nodeStatements, dictionary, edgeStatements, edgeParameters} = graphMLtoCypher(res.body);
        if(nodeStatements.length == 0) throw "no statements to push";
        if(_.isEmpty(dictionary)) throw "Data has no types"
        return dispatch(compileQuery(nodeStatements, dictionary, edgeStatements, edgeParameters));
        
      })
      .catch((err)=> {
        console.log("This error: " , err); // eslint-disable-line
        dispatch(SET("databaseError", "#F50057"));
      });
    });
    // });
  };
}

//post dispatches
export function compileQuery(nodeStatements, dictionary, edgeStatements, edgeParameters){
  return (dispatch) => {
    //send off queries, as promises, because you cannot create edges from nodes that don't already exist
    return dispatch(postQuery(nodeStatements, dictionary)).then(function(){
      let indexStatements = [];
      for (let nodeType in dictionary) {
        indexStatements.push('CREATE INDEX ON :'+ nodeType + ' (nodeID)');
      }
      return dispatch(postQuery(indexStatements)).then(function(){
        return dispatch(postQuery(edgeStatements, edgeParameters));
      });
    });
  };
}


//handle json object ready for cypher conversion
function graphMLtoCypher(jsonObj) {
  let edgeStatements = [],
  edgeParameters = [];
  let {nodeStatements, dictionary, hashMap} = nodeToCypher(jsonObj);
  if(nodeStatements.length > 0){
    //create edges
    if(jsonObj.hasOwnProperty('edges')){
      edgeParameters = _.cloneDeep(jsonObj.edges);
      edgeParameters && edgeParameters.map((item) => {
        if(hashMap.hasOwnProperty(item.toID) && hashMap.hasOwnProperty(item.fromID)){
          item["toType"] = hashMap[item.toID].type;
          item["fromType"] = hashMap[item.fromID].type;
        }
      });
      edgeStatements = edgeToCypher(edgeParameters);
    }  
  }
  //locutions?
  return {nodeStatements, dictionary, edgeStatements, edgeParameters};
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
function edgeToCypher(edgeParameters) {
  //createEdgeStatements
  let edgeStatements = [];
  edgeParameters && edgeParameters.map((edge) => {
    if(edge.hasOwnProperty('fromType') && edge.hasOwnProperty('toType')){
      edgeStatements.push('MATCH (n:' + edge.fromType + '),(m:' + edge.toType +
      ') WHERE n.nodeID=$fromID AND m.nodeID= $toID ' + 
      ' CREATE (n)-[r:LINK{edgeID:$edgeID, source: $fromID, target: $toID, formEdgeID: $formEdgeID}]->(m)'
      );
    }
  });
  return edgeStatements;
}


export function updateNode(oldNode, newNode) {
  return (dispatch) => {
    return dispatch(importNode(newNode)).then(() => {
      return dispatch(removeNode(oldNode)).then(() => {
        return dispatch(updateHash());
      });
    });
  };
}

export function importNode(_newNode){
  if(_.isEmpty(_newNode)) return;
  if(!_newNode.hasOwnProperty('text')) return;
  if(!_newNode.hasOwnProperty("type")) return;
  let newNode = _.cloneDeep(_newNode);
  newNode.text = newNode.text.join(" ");
  return (dispatch) => {
    let {nodeStatements, dictionary} = nodeToCypher({nodes:[newNode]});
    return dispatch(postQuery(nodeStatements, dictionary)).then(function(){
      for (let nodeType in dictionary) {
        dispatch(postQuery(['CREATE INDEX ON :' + nodeType + '(nodeID)'], null));
      }
    }).then(() => {
      return dispatch(updateHash());
    });
  }
}

export function importEdge(_newEdge){
  if(_.isEmpty(_newEdge)) return;
  if(!_newEdge.hasOwnProperty("fromType")) return;
  if(!_newEdge.hasOwnProperty("toType")) return;
  let newEdgeParamenters = _.cloneDeep(_newEdge);
  return (dispatch) => {
    let edgeStatements = edgeToCypher([newEdgeParamenters]);
    return dispatch(postQuery(edgeStatements, newEdgeParamenters)).then(() => {
      dispatch(updateHash());
    });
  };
}

export function removeNode(nodeToRemove){
  return(dispatch) => {
    return dispatch(postQuery("MATCH (n:" + nodeToRemove.type + ")  WHERE n.nodeID=$nodeToRemoveNodeID DELETE n", {"nodeToRemoveNodeID": nodeToRemove.nodeID})).then(() => {// eslint-disable-line
      dispatch(updateHash());
    });
  };
}

export function removeEdges(edgesToRemove){
  if(!Array.isArray(edgesToRemove)){
    edgesToRemove = [edgesToRemove];
  }
  let removeStatements = edgesToRemove.map(()=>{
    return "MATCH (n)-[rel:LINK]->(r) WHERE n.nodeID=$edgeSource AND r.nodeID=$edgeTarget DELETE rel";// eslint-disable-line
  });
  let removeParameters = edgesToRemove.map((edge)=>{
    return {"edgeSource": edge.source, "edgeTarget": edge.target };
  });
  return(dispatch) => {
    return dispatch(postQuery(removeStatements, removeParameters)).then(() => {
      dispatch(updateHash());
    }); 
  };
}

