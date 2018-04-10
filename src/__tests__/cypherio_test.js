import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as cypherio from 'utilities/CypherIO.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';
let CypherIO = require('utilities/CypherIO');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// // function graphMLtoCypher(jsonObj) {
// // }
describe('graphMLtoCypher function', () => {
    beforeEach(()=>{
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    console.log = jest.fn();
    it('converts multiple node json data (without edges) into correct cypher statements', () => {
        const inputData = { //taken from test data
            "nodes": [
                {
                    "nodeID": "232843",
                    "text": "Nova_Jake : she sounds so generic",
                    "type": "L",
                    "timestamp": "2016-11-09 10:16:43",
                    "extra":"data"
                }, 
                {
                    "nodeID": "232844",
                    "text": "Asserting",
                    "type": "YA",
                    "timestamp": "2016-11-09 10:16:43",
                    "scheme": "Asserting",
                    "schemeID": "74"
                },
                {
                    "nodeID": "232847",
                    "text": "phero1190 : he's so childish",
                    "type": "L",
                    "timestamp": "2016-11-09 10:16:44"
                }
            ], 
            "edges":[],
            "locutions":[]
        };
        const expectedNodeStatement = [
            'UNWIND {L} AS map CREATE (n:L) SET n = map',
            'UNWIND {YA} AS map CREATE (n:YA) SET n = map'
        ];
        const expectedDictionary = {
            'L':[{
                "nodeID": "232843",
                "text": "Nova_Jake : she sounds so generic",
                "type": "L",
                "timestamp": "2016-11-09 10:16:43",
                "extra":"data"
            },{
                "nodeID": "232847",
                "text": "phero1190 : he's so childish",
                "type": "L",
                "timestamp": "2016-11-09 10:16:44"
            }],
            'YA':[{
                "nodeID": "232844",
                "text": "Asserting",
                "type": "YA",
                "timestamp": "2016-11-09 10:16:43",
                "scheme": "Asserting",
                "schemeID": "74"
            }]
        };
        const expectedEdgeStatements = [],
        expectedEdgeParameters = [];
        
        let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
        
        return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
    });
    
    it('converts node and edge json data into correct cypher statements', () => {
        const inputData = { //taken from test data
            "nodes": [{
                "nodeID": "262660",
                "text": "Restating",
                "type": "YA",
                "timestamp": "2017-03-06 13:15:21",
                "scheme": "Restating",
                "schemeID": "101"
            },{
                "nodeID": "262658",
                "text": "Default Rephrase",
                "type": "MA",
                "timestamp": "2017-03-06 13:15:20",
                "scheme": "Default Rephrase",
                "schemeID": "144"
            },
        ], 
        "edges":[{
            "edgeID": "316914",
            "fromID": "262660",
            "toID": "262658",
            "formEdgeID": null
        }],
        "locutions":[]
    };
    const expectedNodeStatement = [
        'UNWIND {YA} AS map CREATE (n:YA) SET n = map',
        'UNWIND {MA} AS map CREATE (n:MA) SET n = map'
    ];
    const expectedDictionary = {
        'YA':[{
            "nodeID": "262660",
            "text": "Restating",
            "type": "YA",
            "timestamp": "2017-03-06 13:15:21",
            "scheme": "Restating",
            "schemeID": "101"
        }],
        'MA':[{ 
            "nodeID": "262658",
            "text": "Default Rephrase",
            "type": "MA",
            "timestamp": "2017-03-06 13:15:20",
            "scheme": "Default Rephrase",
            "schemeID": "144"
        }]
    };
    const expectedEdgeStatements = [
        'MATCH (n:YA),(m:MA) WHERE n.nodeID=$fromID AND m.nodeID= $toID  CREATE (n)-[r:LINK{edgeID:$edgeID, source: $fromID, target: $toID, formEdgeID: $formEdgeID}]->(m)'
    ],   expectedEdgeParameters = [{"edgeID": "316914", "formEdgeID": null, "fromID": "262660", "fromType": "YA", "toID": "262658", "toType": "MA" }];
    
    let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
    
    return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
});

it('does not error when passed empty json data', () => {
    const inputData = { 
        "nodes": [], 
        "edges":[],
        "locutions":[]
    };
    const expectedNodeStatement = [];
    const expectedDictionary = {};
    const expectedEdgeStatements = [],
    expectedEdgeParameters = [];
    
    let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
    
    return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
});

it('does not error when passed invalid json data', () => {
    const inputData = { 
        "hello": [], 
        "world":[]
    };
    const expectedNodeStatement = [];
    const expectedDictionary = {};
    const expectedEdgeStatements = [],
    expectedEdgeParameters = [];
    
    let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
    
    return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
});

//This is because neo4j requires an node before it can create a link.
it('returns empty when only passed edges json data', () => {
    const inputData = { 
        "nodes": [
            
        ], 
        "edges":[{
            "edgeID": "316914",
            "fromID": "262660",
            "toID": "262658",
            "formEdgeID": null
        }],
        "locutions":[]
    };
    const expectedNodeStatement = [];
    const expectedDictionary = {};
    const expectedEdgeStatements = [],
    expectedEdgeParameters = [];
    
    let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
    
    return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
});

it('returns empty when only passed node json without \'type\' property', () => {
    const inputData = { 
        "nodes": [{
            "nodeID": "262660",
            "text": "Restating",
            "timestamp": "2017-03-06 13:15:21",
            "scheme": "Restating",
            "schemeID": "101"
        }], 
        "edges":[],
        "locutions":[]
    };
    const expectedNodeStatement = [];
    const expectedDictionary = {};
    const expectedEdgeStatements = [],
    expectedEdgeParameters = [];
    
    let graphMLtoCypher = CypherIO.__get__('graphMLtoCypher');
    
    return expect(graphMLtoCypher(inputData)).toEqual({nodeStatements: expectedNodeStatement, dictionary: expectedDictionary, edgeStatements: expectedEdgeStatements, edgeParameters: expectedEdgeParameters});
});

})


//Import json from local file. Await for database to be wiped via promise before continuing..
//export function importJSON(dataFile) {
describe('importJSON function', () => {
    beforeEach(()=>{
        jest.mock('../__mocks__/superagent');
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    it('Checks if WipeDatabase gets called', () => {
        const dataFile = {
            body:{
                nodes:[],
                edges:[]
            }
        }
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            {"payload": "#FFFFFF", "type": "SET", "variable": "databaseError"}, 
            {"payload": [], "type": "SET", "variable": "nodes"}, //if this is called we are good.
            {"payload": [], "type": "SET", "variable": "links"}, //if this is called we are good.
            {"payload": "11130", "type": "SET", "variable": "currentDataFile"},
            {"payload": "#F50057", "type": "SET", "variable": "databaseError"}
        ]
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        //because I used superagent to retreive local datafile, I just mock with the unique response this time.
        myModule.get = function(){return Promise.resolve(dataFile);};
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.wipeDatabase = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('nodes', []));
                dispatch(actions.SET('links', []));
                return Promise.resolve();          
            }
        }
        
        myModule2.postQuery = () =>{
            return (dispatch) =>{
                console.log("RUNNING MOCKED postQuery")
                return Promise.resolve();          
            }
        }
        myModule2.updateHash = () =>{
            return (dispatch) =>{
                console.log("RUNNING MOCKED updateHash")
                return Promise.resolve();          
            }
        }
        
        return store.dispatch(cypherio.importJSON('11130')).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })
        
    });
    
    it('Checks if data gets put through to compileQuery', () => {
        const dataFile = {
            body:{
                nodes:[{nodeID:"test1"}, {nodeID:"test2"}],
                edges:[]
            }
        }
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            {"payload": "#FFFFFF", "type": "SET", "variable": "databaseError"}, 
            {"payload": [], "type": "SET", "variable": "nodes"}, 
            {"payload": [], "type": "SET", "variable": "links"}, 
            {"payload": "11130", "type": "SET", "variable": "currentDataFile"}, 
            {"payload": [{
                "edges": [], 
                "nodes": [
                    {"nodeID": "test1"},
                    {"nodeID": "test2"}
                ]
            }], "type": "SET", "variable": "nodes"}
        ]
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        //because I used superagent to retreive local datafile, I just mock with the unique response this time.
        myModule.get = function(){return Promise.resolve(dataFile);};
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.wipeDatabase = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('nodes', []));
                dispatch(actions.SET('links', []));
                return Promise.resolve();          
            }
        }
        
        
        CypherIO.__set__('compileQuery', (nodeStatements, dictionary, edgeStatements, edgeParameters) => {
            return (dispatch) =>{
                dispatch(actions.SET('nodes', nodeStatements));
            }
        });
        
        CypherIO.__set__('graphMLtoCypher', (body) => {
            return {nodeStatements:[body], dictionary:{A:"A"}, edgeStatements:"", edgeParameters:""};
        });
        
        store.dispatch(cypherio.importJSON('11130')).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })        
    });
    
    
    it('Checks if dictionary is empty, throw error', () => {
        const dataFile = {
            body:{
                nodes:[{nodeID:"test1"}, {nodeID:"test2"}],
                edges:[]
            }
        }
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            {"payload": "#FFFFFF", "type": "SET", "variable": "databaseError"}, 
            {"payload": [], "type": "SET", "variable": "nodes"}, 
            {"payload": [], "type": "SET", "variable": "links"}, 
            {"payload": "11130", "type": "SET", "variable": "currentDataFile"}, 
            {"payload": "#F50057", "type": "SET", "variable": "databaseError"},
        ]
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        //because I used superagent to retreive local datafile, I just mock with the unique response this time.
        myModule.get = function(){return Promise.resolve(dataFile);};
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.wipeDatabase = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('nodes', []));
                dispatch(actions.SET('links', []));
                return Promise.resolve();          
            }
        }
        
        
        CypherIO.__set__('compileQuery', (nodeStatements, dictionary, edgeStatements, edgeParameters) => {
            return (dispatch) =>{
                dispatch(actions.SET('nodes', nodeStatements));
            }
        });
        
        CypherIO.__set__('graphMLtoCypher', (body) => {
            return {nodeStatements:[body], dictionary:{}, edgeStatements:"", edgeParameters:""};
        });
        
        store.dispatch(cypherio.importJSON('11130')).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })        
    });
    
    it('Errors when datafile does not exist', () => {
        const dataFile = null;
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            {"payload": "#FFFFFF", "type": "SET", "variable": "databaseError"}, 
            {"payload": [], "type": "SET", "variable": "nodes"}, 
            {"payload": [], "type": "SET", "variable": "links"}, 
            {"payload": "#F50057", "type": "SET", "variable": "databaseError"} //this is the failure we are looking for.
        ]
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        //because I used superagent to retreive local datafile, I just mock with the unique response this time.
        myModule.get = function(){return Promise.resolve();};
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.wipeDatabase = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('nodes', []));
                dispatch(actions.SET('links', []));
                return Promise.resolve();          
            }
        }
        
        store.dispatch(cypherio.importJSON('11130')).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })        
    });
})

// //post dispatches
// //function compileQuery(nodeStatements, dictionary, edgeStatements, edgeParameters){
describe('compileQuery function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    it('Check if nodes, indexes and edges are called in sequence', () => {
        const nodeStatements = {"nodeStatements":"nodeStatements"},
        dictionary = {"dictionary":"dictionary"},
        edgeStatements = {"edgeStatements":"edgeStatements"},
        edgeParameters ={"edgeParameters":"edgeParameters"};
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            //nodeStatements
            {"payload": {"nodeStatements": "nodeStatements"}, "type": "SET", "variable": "statements"}, 
            {"payload": {"dictionary": "dictionary"}, "type": "SET", "variable": "parameters"},
            //Indexes
            {"payload": ["CREATE INDEX ON :dictionary (nodeID)"], "type": "SET", "variable": "statements"}, 
            {"payload": null, "type": "SET", "variable": "parameters"}, 
            //edgeStatements
            {"payload": {"edgeStatements": "edgeStatements"}, "type": "SET", "variable": "statements"}, 
            {"payload": {"edgeParameters": "edgeParameters"}, "type": "SET", "variable": "parameters"}
        ];
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.postQuery = (statements, parameters = null) =>{
            return (dispatch) =>{
                dispatch(actions.SET("statements", statements));
                dispatch(actions.SET("parameters", parameters));
                return Promise.resolve();          
            }
        }
        
        store.dispatch(cypherio.compileQuery(nodeStatements, dictionary, edgeStatements, edgeParameters)).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })  
    });
    
    it('Check if all indexes have correct cypher statements', () => {
        const nodeStatements = {"nodeStatements":"nodeStatements"},
        dictionary = {A:"A", B:"B", C:"C"},
        edgeStatements = {"edgeStatements":"edgeStatements"},
        edgeParameters ={"edgeParameters":"edgeParameters"};
        const store = mockStore({ });
        const expectedActions_SUCCESS = [
            //nodeStatements
            {"payload": {"nodeStatements": "nodeStatements"}, "type": "SET", "variable": "statements"}, 
            {"payload": {A:"A", B:"B", C:"C"}, "type": "SET", "variable": "parameters"},
            //Indexes
            {"payload": ["CREATE INDEX ON :A (nodeID)", "CREATE INDEX ON :B (nodeID)", "CREATE INDEX ON :C (nodeID)"], "type": "SET", "variable": "statements"}, 
            {"payload": null, "type": "SET", "variable": "parameters"}, 
            //edgeStatements
            {"payload": {"edgeStatements": "edgeStatements"}, "type": "SET", "variable": "statements"}, 
            {"payload": {"edgeParameters": "edgeParameters"}, "type": "SET", "variable": "parameters"}
        ];
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.postQuery = (statements, parameters = null) =>{
            return (dispatch) =>{
                dispatch(actions.SET("statements", statements));
                dispatch(actions.SET("parameters", parameters));
                return Promise.resolve();          
            }
        }
        
        store.dispatch(cypherio.compileQuery(nodeStatements, dictionary, edgeStatements, edgeParameters)).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })  
    });
})

//handle json object ready for cypher conversion
//function nodeToCypher(jsonObj) {
describe('nodeToCypher function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    it('Check that it returns empty if no nodes property in parameter', () => {
        let jsonObj = {
            
        };
        let nodeToCypher = CypherIO.__get__('nodeToCypher');
        return expect(nodeToCypher(jsonObj)).toEqual({nodeStatements:[], dictionary:{}, hashMap:{}})
    });
    
    it('Check that it returns empty if no nodes in parameter', () => {
        let jsonObj = {
            nodes:[]
        };
        let nodeToCypher = CypherIO.__get__('nodeToCypher');
        return expect(nodeToCypher(jsonObj)).toEqual({nodeStatements:[], dictionary:{}, hashMap:{}})
    });
    
    it('Check that it returns correct nodeStatements from nodes in parameter', () => {
        let jsonObj = {
            nodes:[{nodeID:"0001", type:"A"}]
        },
        dictionary =  {
            "A":  [{
                "nodeID": "0001",
                "type": "A",
            },
        ]},
        hashMap = {
            "0001": {
                "nodeID": "0001",
                "type": "A",
            }
        }
        
        let nodeStatements = ['UNWIND {A} AS map CREATE (n:A) SET n = map'];
        let nodeToCypher = CypherIO.__get__('nodeToCypher');
        return expect(nodeToCypher(jsonObj)).toEqual({"nodeStatements":nodeStatements, "dictionary":dictionary, "hashMap":hashMap});
    });
    it('Check that it does not error from nodes without a type', () => {
        let jsonObj = {
            nodes:[{nodeID:"0001"}]
        },
        dictionary =  {},
        hashMap = { }
        
        let nodeStatements = [];
        let nodeToCypher = CypherIO.__get__('nodeToCypher');
        return expect(nodeToCypher(jsonObj)).toEqual({"nodeStatements":nodeStatements, "dictionary":dictionary, "hashMap":hashMap});
    });
})

// //handle json object ready for cypher conversion
// //function edgeToCypher(edgeParameters) {
describe('edgeToCypher function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    it('when invalid variable are passed, return empty array', () => {
        let edgeToCypher = CypherIO.__get__('edgeToCypher');
        return expect(edgeToCypher("")).toEqual([])
    });
    
    it('when no edges are passed (empty array), return empty array', () => {
        let edgeToCypher = CypherIO.__get__('edgeToCypher');
        return expect(edgeToCypher([])).toEqual([])
    });
    
    it('when edges are passed without fromType or toType fields,  return empty array', () => {
        let edgeParameters = [{edgeID:"0001"}]
        let edgeToCypher = CypherIO.__get__('edgeToCypher');
        return expect(edgeToCypher(edgeParameters)).toEqual([])
    });
    
    it('when edges are passed with fromType or toType fields,  return formatted edgeStatement', () => {
        let edgeParameters = [{edgeID:"0001", fromType:"A", toType:"B"}];
        let edgeStatements = [
            'MATCH (n:A),(m:B) WHERE n.nodeID=$fromID AND m.nodeID= $toID ' + 
            ' CREATE (n)-[r:LINK{edgeID:$edgeID, source: $fromID, target: $toID, formEdgeID: $formEdgeID}]->(m)'
        ]
        let edgeToCypher = CypherIO.__get__('edgeToCypher');
        return expect(edgeToCypher(edgeParameters)).toEqual(edgeStatements)
    });
})

//export function updateNode(oldNode, amendedNode) {
describe('updateNode function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    
    it('Correctly calls import, remove and updateHash in sequence', () => {
        const store = mockStore({ });
        
        let oldNode = {nodeID: "001"},
        newNode = {nodeID: "002"};
        const expectedActions_SUCCESS = [
            {"payload": {"nodeID": "002"}, "type": "UPDATE", "variable": "nodes"}, //put the new node
            {"id": {"nodeID": "001"}, "payload": "nodeID", "type": "DROP", "variable": "nodes"}, //drop the old
            {"payload": "abc", "type": "SET", "variable": "hash"}
        ]; //update hash
        
        CypherIO.__set__('importNode', (newNode) => {
            return (dispatch) =>{
                dispatch(actions.UPDATE('nodes', newNode, "nodeID"));
                return Promise.resolve();  
            }
        });
        
        CypherIO.__set__('removeNode', (oldNode) => {
            return (dispatch) =>{
                dispatch(actions.DROP('nodes', oldNode, "nodeID"));
                return Promise.resolve();  
            }
        });
        
        
        const myModule2 = require('../utilities/DBConnection');
        myModule2.updateHash = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('hash', "abc"));
                return Promise.resolve();   
            }
        }
        
        store.dispatch(CypherIO.updateNode(oldNode,newNode)).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        });
    });
})

// //export function importNode(_newNode){
describe('importNode function', () => {
    beforeEach(()=>{
        jest.mock('../__mocks__/superagent');
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
    });
    it('check it returns when no object passed', () => {
        expect(cypherio.importNode({})).toEqual();
    });
    
    it('check it returns when not text property', () => {
        expect(cypherio.importNode({"nodeID":"001"})).toEqual();
    });
    
    it('check it returns nothing when nodeToCypher fails', () => {
        const store = mockStore({ });
        const expectedActions_SUCCESS = 
        [{"payload": [], "type": "SET", "variable": "statements"}, {"payload": {}, "type": "SET", "variable": "parameters"}, {"payload": "A", "type": "SET", "variable": "hash"}];
        
        
        const myModule3 = require('../utilities/DBConnection');
        myModule3.postQuery = (statements, parameters = null) =>{
            return (dispatch) =>{
                dispatch(actions.SET('statements', statements));
                dispatch(actions.SET('parameters', parameters));
                return Promise.resolve();   
            }
        }
        
        myModule3.updateHash = () =>{
            return (dispatch) =>{
                dispatch(actions.SET('hash', "A"));
                return Promise.resolve();   
            }
        }
        
        CypherIO.__set__('nodeToCypher', (object) => {
            return {nodeStatements:[], dictionary:{}};
        });
        
        store.dispatch(cypherio.importNode({"nodeID":"001", text:["text here"], type:"A"})).then((string)=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        });
    });
})
