import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as cypherio from 'utilities/CypherIO.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';
let CypherIO = require('utilities/CypherIO');
let DBConnection = require('utilities/DBConnection');


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

