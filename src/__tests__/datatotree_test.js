import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as datatotree from 'utilities/DataToTree.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';
let DataToTree = require('utilities/DataToTree');
import * as d3 from 'd3';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
//create hash of nodes, links by source and targets (speeds up search)
// function createDataHashes(nodes, links){
// }
describe('createDataHashes function', () => {
    beforeEach(()=>{
        DataToTree.__set__('nodeHash', {});
        DataToTree.__set__('linkHashBySource', {});
        DataToTree.__set__('linkHashByTarget', {});
        DataToTree.__set__('possibleLoopHash', {});
    });
    
    afterEach(() => {
        
    });
    
    it('creates hashtables from nodes', () => {
        
        const nodes = [{nodeID:"id1"}, {"nodeID":"id2"}, {"nodeID":"id3"}];
        const links = [];
        
        const expectedNodeHash = {
            "id1":{"nodeID":"id1", "depthArray":[]}, 
            "id2":{"nodeID":"id2", "depthArray":[]}, 
            "id3":{"nodeID":"id3", "depthArray":[]}, 
        },
        expectedLinkHashBySource = {}, 
        expectedLinkHashByTarget = {};
        
        let createDataHashes = DataToTree.__get__('createDataHashes');
        DataToTree.__set__('nodeHash', {});
        DataToTree.__set__('linkHashBySource', {});
        DataToTree.__set__('linkHashByTarget', {});
        
        return expect(createDataHashes(nodes, links)).toEqual({nodeHash:expectedNodeHash, linkHashBySource: expectedLinkHashBySource, linkHashByTarget: expectedLinkHashByTarget});
    });
    
    it('creates hashtables from edges', () => {
        
        const nodes = [];
        const links = [
            {source:"id1", target:"id2"},
            {source:"id2", target:"id3"}];
            
            const expectedNodeHash = {},
            expectedLinkHashBySource = {
                "id1":[{source:"id1", target:"id2"}],
                "id2":[{source:"id2", target:"id3"}]
            }, 
            expectedLinkHashByTarget = {  
                "id2":[{source:"id1", target:"id2"}],
                "id3":[{source:"id2", target:"id3"}
            ]};
            
            let createDataHashes = DataToTree.__get__('createDataHashes');
            DataToTree.__set__('nodeHash', {});
            DataToTree.__set__('linkHashBySource', {});
            DataToTree.__set__('linkHashByTarget', {});
            
            return expect(createDataHashes(nodes, links)).toEqual({nodeHash:expectedNodeHash, linkHashBySource: expectedLinkHashBySource, linkHashByTarget: expectedLinkHashByTarget});
        });
        
    })
    
    // function calculatePossibleDepths(rootNodes){
    // }
    //adds suspected layer to depthLayer array
    // function possibleDepthTraversalRecurssively(nodeID, counter) {
    // }
    describe('calculatePossibleDepths function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });
        
        it('makes NodeHash have correct layers from a simple node graph', () => {
            
            const rootNodes = [{nodeID:"id1"}];
            
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[]},
                "id2": {nodeID:"id2", depthArray:[]},
                "id3": {nodeID:"id3", depthArray:[]}
            },
            linkHashBySource = {
                "id1":[{source:"id1", target:"id2"}],
                "id2":[{source:"id2", target:"id3"}]
            }, 
            linkHashByTarget = {  
                "id2":[{source:"id1", target:"id2"}],
                "id3":[{source:"id2", target:"id3"}
            ]};
            
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1",depthArray:[], layer:0},
                "id2": {nodeID:"id2", depthArray:[1], layer:1},
                "id3": {nodeID:"id3", depthArray:[2], layer:2}
            };
            
            let calculatePossibleDepths = DataToTree.__get__('calculatePossibleDepths');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashBySource', linkHashBySource);
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            DataToTree.__set__('possibleLoopHash', {});
            expect(calculatePossibleDepths(rootNodes)).toEqual(rootNodes);
            expect(DataToTree.__get__('nodeHash', nodeHash)).toEqual(expectedNodeHash);
        });
        
        it('Does not error when there is a loop in nodes', () => {
            
            const rootNodes = [{nodeID:"id1"}];
            
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[]},
                "id2": {nodeID:"id2", depthArray:[]},
            },
            linkHashBySource = {
                "id1":[{source:"id1", target:"id2"}],
                "id2":[{source:"id2", target:"id1"}]
            }, 
            linkHashByTarget = {  
                "id2":[{source:"id1", target:"id2"}],
                "id1":[{source:"id2", target:"id1"}
            ]};
            
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1",depthArray:[2], layer:2},
                "id2": {nodeID:"id2", depthArray:[1], layer:1}
            };
            
            let calculatePossibleDepths = DataToTree.__get__('calculatePossibleDepths');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashBySource', linkHashBySource);
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            DataToTree.__set__('possibleLoopHash', {});
            
            expect(calculatePossibleDepths(rootNodes)).toEqual(rootNodes);
            expect(DataToTree.__get__('nodeHash', nodeHash)).toEqual(expectedNodeHash);
        });
        
    })
    
    // function getNodesWithMaxDepth(){
    // }
    describe('getNodesWithMaxDepth function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });
        
        it('Returns list of max depths in assending order', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[2, 3, 4], layer: 3},
                "id2": {nodeID:"id2", depthArray:[1, 2], layer: 2},
                "id3": {nodeID:"id3", depthArray:[3, 5], layer: 5}
            };
            
            const expectedNodeDepthConflict = [
                {nodeID:"id2", size: 2},        
                {nodeID:"id1", size: 4},
                {nodeID:"id3", size: 5}
            ]; 
            
            
            let getNodesWithMaxDepth = DataToTree.__get__('getNodesWithMaxDepth');
            DataToTree.__set__('nodeHash', nodeHash);
            
            
            return expect(getNodesWithMaxDepth()).toEqual(expectedNodeDepthConflict);
        });
        
        it('Returns empty list when nodeHash only has single length depth arrays', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[2], layer: 2},
                "id2": {nodeID:"id2", depthArray:[1], layer: 1},
                "id3": {nodeID:"id3", depthArray:[3], layer: 3}
            };
            
            const expectedNodeDepthConflict = [
            ]; 
            
            
            let getNodesWithMaxDepth = DataToTree.__get__('getNodesWithMaxDepth');
            DataToTree.__set__('nodeHash', nodeHash);
            return expect(getNodesWithMaxDepth()).toEqual(expectedNodeDepthConflict);
        });
        
        it('Updates totalNumOfLayers to highest number in overall depth arrays', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[2, 3, 4], layer: 3},
                "id2": {nodeID:"id2", depthArray:[1, 2], layer: 2},
                "id3": {nodeID:"id3", depthArray:[3, 5], layer: 5}
            };
            
            const expectedNodeDepthConflict = [
                {nodeID:"id2", size: 2},        
                {nodeID:"id1", size: 4},
                {nodeID:"id3", size: 5}
            ]; 
            
            let getNodesWithMaxDepth = DataToTree.__get__('getNodesWithMaxDepth');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('totalNumOfLayers', 0);
            expect(getNodesWithMaxDepth()).toEqual(expectedNodeDepthConflict);
            return expect(DataToTree.__get__('totalNumOfLayers')).toEqual(5);
        });
        
    })
    
    //Recursively goes through and adds correct children to each node
    // function applyChildrenRecurssively(node, children){
    // }
    describe('applyChildrenRecurssively function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });
        
        it('Returns list of children for that root node', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[]},
                "id2": {nodeID:"id2", depthArray:[]},
                "id3": {nodeID:"id3", depthArray:[]},
                "id4": {nodeID:"id4", depthArray:[]},
                "id5": {nodeID:"id5", depthArray:[]}
            },
            linkHashBySource = {
                "id1":[{source:"id1", target:"id2"},{source:"id1", target:"id3"}],
                "id2":[{source:"id2", target:"id4"},{source:"id2", target:"id5"}]
            };
            
            const expectedChildren = [
                {"children": [{"children": [], "depthArray": [], "name": "id4", "nodeID": "id4", "parent": "id2"}, {"children": [], "depthArray": [], "name": "id5", "nodeID": "id5", "parent": "id2"}], "depthArray": [], "name": "id2", "nodeID": "id2", "parent": "id1"}, 
                              {"children": [], "depthArray": [], "name": "id3", "nodeID": "id3", "parent": "id1"}]
            
            let applyChildrenRecurssively = DataToTree.__get__('applyChildrenRecurssively');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashBySource', linkHashBySource);
            DataToTree.__set__('applyChildrenLoopHash', {});
            
            return expect(applyChildrenRecurssively("id1", [])).toEqual(expectedChildren);
        });

        it('Returns empty array as there are no children for this graph set', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1",depthArray:[]}
            },
            linkHashBySource = {
            };
            
            const expectedChildren = [];
            
            let applyChildrenRecurssively = DataToTree.__get__('applyChildrenRecurssively');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashBySource', linkHashBySource);
            DataToTree.__set__('applyChildrenLoopHash', {});
            
            return expect(applyChildrenRecurssively("id1", [])).toEqual(expectedChildren);
        });
        
        
    })
    
    //Adjusts layer height based off maximum layer found in child
    // function correctDepthTraversalRecurssively(nodeID, counter) {
    // }
    describe('correctDepthTraversalRecurssively function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });
        
        it('Successfully traverses and depth review on a simple graph', () => {      
            const nodeHash = {
                "id1": {nodeID:"id1", layer: 0},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},
                "id5": {nodeID:"id5", layer: 3}
            }, linkHashByTarget = {
                "id2":[{source:"id1", target:"id2"}],
                "id3":[{source:"id1", target:"id3"}],
                "id4":[{source:"id2", target:"id4"}],
                "id5":[{source:"id2", target:"id5"}]
            };

            const expectedNodeHash = {
                "id1": {nodeID:"id1", layer: 1},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},
                "id5": {nodeID:"id5", layer: 3}
            }; 
          
            let correctDepthTraversalRecurssively = DataToTree.__get__('correctDepthTraversalRecurssively');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            DataToTree.__set__('correctLoopHash', {});
            
            expect(correctDepthTraversalRecurssively("id5", (2))).toEqual(undefined);
            return expect(DataToTree.__get__('nodeHash')).toEqual(expectedNodeHash);
        });  
        
        
        it('Does not error when there is a loop in nodes', () => {
            
            const nodeHash = {
                "id1": {nodeID:"id1", layer: 0},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},
            }, linkHashByTarget = {
                "id2":[{source:"id1", target:"id2"},{source:"id4", target:"id2"}],
                "id3":[{source:"id1", target:"id3"}],
                "id4":[{source:"id2", target:"id4"}],
            };
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1", layer: 1},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 1},
            };
            
            let correctDepthTraversalRecurssively = DataToTree.__get__('correctDepthTraversalRecurssively');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            DataToTree.__set__('correctLoopHash', {});
            
            expect(correctDepthTraversalRecurssively("id4", (2))).toEqual(undefined);
            return expect(DataToTree.__get__('nodeHash')).toEqual(expectedNodeHash);
        });
        
    })
    
   
    //gets all the nodes that do not have parents
    // function getRootNodes(nodes) {
    // }
    describe('getRootNodes function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });        
        
        it('Returns root nodes only in reverse order when without timestamp property', () => {
            const nodes = [
                {nodeID:"id1"},
                {nodeID:"id2"},
                {nodeID:"id3"},
                {nodeID:"id4"},
            ], linkHashByTarget = {
                "id2":[{source:"id1", target:"id2"},{source:"id4", target:"id2"}],
                "id4":[{source:"id2", target:"id4"}],
            };
            
            const expectedRootNodes = [
                {nodeID:"id3"},
                {nodeID:"id1"}                
            ];
            
            let getRootNodes = DataToTree.__get__('getRootNodes');
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            return expect(getRootNodes(nodes)).toEqual(expectedRootNodes);
        });

        it('Returns root nodes only in reverse order when with timestamp property', () => {
            const nodes = [
                {nodeID:"id1", timestamp:"2016-11-08 18:14:11"},
                {nodeID:"id2", timestamp:"2016-11-08 18:14:12"},
                {nodeID:"id3", timestamp:"2016-11-08 18:14:13"},
                {nodeID:"id4", timestamp:"2016-11-08 18:14:14"},
            ], linkHashByTarget = {
                "id2":[{source:"id1", target:"id2"},{source:"id4", target:"id2"}],
                "id4":[{source:"id2", target:"id4"}],
            };
            
            const expectedRootNodes = [
                {nodeID:"id1", timestamp:"2016-11-08 18:14:11"},
                {nodeID:"id3", timestamp:"2016-11-08 18:14:13"}                              
            ];
            
            let getRootNodes = DataToTree.__get__('getRootNodes');
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            return expect(getRootNodes(nodes)).toEqual(expectedRootNodes);
        });

        it('Returns first node if no root nodes', () => {
            const nodes = [
                {nodeID:"id1"},
                {nodeID:"id2"},
                {nodeID:"id3"},
                {nodeID:"id4"},
            ], linkHashByTarget = {
                "id1":[{source:"id1", target:"id2"}],
                "id2":[{source:"id2", target:"id4"}],
                "id3":[{source:"id2", target:"id4"}],
                "id4":[{source:"id2", target:"id4"}],
            };
            
            const expectedRootNodes = [
                {nodeID:"id1"}                
            ];
            
            let getRootNodes = DataToTree.__get__('getRootNodes');
            DataToTree.__set__('linkHashByTarget', linkHashByTarget);
            return expect(getRootNodes(nodes)).toEqual(expectedRootNodes);
        });
        
    })


    //Because some graphs loop back on themselves, the layers can get into negative numbers. This adjusts this error.
    // function fixLayerCount(){
    // }
    describe('fixLayerCount function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });        
        
        it('Do not change the node layer if already ok', () => {
            const nodeHash = {
                "id1": {nodeID:"id1", layer: 0},
                "id2": {nodeID:"id2", layer: 1},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},
            };
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1", layer: 0},
                "id2": {nodeID:"id2", layer: 1},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},                
            };
            
            let fixLayerCount = DataToTree.__get__('fixLayerCount');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('lowestNumOfLayers', 0);
            DataToTree.__set__('totalNumOfLayers', 4);
            expect(fixLayerCount()).toEqual(undefined);
            expect(DataToTree.__get__('lowestNumOfLayers')).toEqual(0);
            return expect(DataToTree.__get__('nodeHash')).toEqual(expectedNodeHash)
        });  
        
        it('if layers have shifted negatively past 0', () => {
            const nodeHash = {
                "id1": {nodeID:"id1", layer: -1},
                "id2": {nodeID:"id2", layer: 0},
                "id3": {nodeID:"id3", layer: 1},
                "id4": {nodeID:"id4", layer: 2},
            };
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1", layer: 0},
                "id2": {nodeID:"id2", layer: 1},
                "id3": {nodeID:"id3", layer: 2},
                "id4": {nodeID:"id4", layer: 3},                
            };
            
            let fixLayerCount = DataToTree.__get__('fixLayerCount');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('lowestNumOfLayers', 0);
            DataToTree.__set__('totalNumOfLayers', 4);
            expect(fixLayerCount()).toEqual(undefined);
            expect(DataToTree.__get__('lowestNumOfLayers')).toEqual(0);
            return expect(DataToTree.__get__('nodeHash')).toEqual(expectedNodeHash)
        }); 

        it('if layers have shifted positively past 0', () => {
            const nodeHash = {
                "id1": {nodeID:"id1", layer: 1},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 3},
                "id4": {nodeID:"id4", layer: 4},
            };
            
            const expectedNodeHash = {
                "id1": {nodeID:"id1", layer: 1},
                "id2": {nodeID:"id2", layer: 2},
                "id3": {nodeID:"id3", layer: 3},
                "id4": {nodeID:"id4", layer: 4},                
            };
            
            let fixLayerCount = DataToTree.__get__('fixLayerCount');
            DataToTree.__set__('nodeHash', nodeHash);
            DataToTree.__set__('lowestNumOfLayers', 0);
            DataToTree.__set__('totalNumOfLayers', 4);
            expect(fixLayerCount()).toEqual(undefined);
            expect(DataToTree.__get__('lowestNumOfLayers')).toEqual(0);
            return expect(DataToTree.__get__('nodeHash')).toEqual(expectedNodeHash)
        }); 

    }) 
    
    
    // export function convertRawToTree(object) { 
    // }
    describe('convertRawToTree function', () => {
        beforeEach(()=>{
            
        });
        
        afterEach(() => {
            
        });        
        
        it('Correctly dispatches SET to corrected node data', () => {
            const object = {
                "nodes": [ { "nodeID": "229461", "text": "Lemonyfrogs : Holy hell he's justifying the time he got sued for discrimination by saying he wasn't guilty", "type": "L", "timestamp": "2016-11-08 17:56:31" }, { "nodeID": "229463", "text": "Holy hell TRUMP's justifying the time TRUMP got sued for discrimination by saying TRUMP wasn't guilty", "type": "I", "timestamp": "2016-11-08 17:56:31" }, { "nodeID": "229506", "text": "djoliverm : why would you settle if you know it's not true", "type": "L", "timestamp": "2016-11-08 17:56:36" }, { "nodeID": "229508", "text": "you wouldn't settle if you know it's not true", "type": "I", "timestamp": "2016-11-08 17:56:36" }, { "nodeID": "229577", "text": "DelusionalTexan : Common practice when the lawsuit would waste money and time", "type": "L", "timestamp": "2016-11-08 17:56:43" }, { "nodeID": "229579", "text": "Common practice when the lawsuit would waste money and time", "type": "I", "timestamp": "2016-11-08 17:56:43" }, { "nodeID": "236606", "text": "TRUMP : I settled that lawsuit with no admission of guilt , but that was a lawsuit brought against many real estate firms , and it 's just one of those things", "type": "L", "timestamp": "2016-11-09 15:59:23" }, { "nodeID": "236608", "text": "TRUMP settled that lawsuit with no admission of guilt , but that was a lawsuit brought against many real estate firms , and it 's just one of those things", "type": "I", "timestamp": "2016-11-09 15:59:23" }, { "nodeID": "262796", "text": "Default Rephrase", "type": "MA", "timestamp": "2017-03-06 17:22:49", "scheme": "Default Rephrase", "schemeID": "144" }, { "nodeID": "262797", "text": "Default Transition", "type": "TA", "timestamp": "2017-03-06 17:22:50", "scheme": "Default Transition", "schemeID": "82" }, { "nodeID": "262798", "text": "Restating", "type": "YA", "timestamp": "2017-03-06 17:22:50", "scheme": "Restating", "schemeID": "101" }, { "nodeID": "262799", "text": "Default Conflict", "type": "CA", "timestamp": "2017-03-06 17:22:51", "scheme": "Default Conflict", "schemeID": "71" }, { "nodeID": "262800", "text": "Default Transition", "type": "TA", "timestamp": "2017-03-06 17:22:52", "scheme": "Default Transition", "schemeID": "82" }, { "nodeID": "262801", "text": "Disagreeing", "type": "YA", "timestamp": "2017-03-06 17:22:52", "scheme": "Disagreeing", "schemeID": "78" }, { "nodeID": "262802", "text": "Default Inference", "type": "RA", "timestamp": "2017-03-06 17:22:53", "scheme": "Default Inference", "schemeID": "72" }, { "nodeID": "262803", "text": "Default Transition", "type": "TA", "timestamp": "2017-03-06 17:22:54", "scheme": "Default Transition", "schemeID": "82" }, { "nodeID": "262804", "text": "Arguing", "type": "YA", "timestamp": "2017-03-06 17:22:54", "scheme": "Arguing", "schemeID": "80" } ], "edges": [ { "edgeID": "317190", "fromID": "229463", "toID": "262796", "formEdgeID": null }, { "edgeID": "317191", "fromID": "262796", "toID": "236608", "formEdgeID": null }, { "edgeID": "317192", "fromID": "236606", "toID": "262797", "formEdgeID": null }, { "edgeID": "317193", "fromID": "262797", "toID": "229461", "formEdgeID": null }, { "edgeID": "317194", "fromID": "262797", "toID": "262798", "formEdgeID": null }, { "edgeID": "317195", "fromID": "262798", "toID": "262796", "formEdgeID": null }, { "edgeID": "317196", "fromID": "229508", "toID": "262799", "formEdgeID": null }, { "edgeID": "317197", "fromID": "262799", "toID": "236608", "formEdgeID": null }, { "edgeID": "317198", "fromID": "236606", "toID": "262800", "formEdgeID": null }, { "edgeID": "317199", "fromID": "262800", "toID": "229506", "formEdgeID": null }, { "edgeID": "317200", "fromID": "262800", "toID": "262801", "formEdgeID": null }, { "edgeID": "317201", "fromID": "262801", "toID": "262799", "formEdgeID": null }, { "edgeID": "317202", "fromID": "229579", "toID": "262802", "formEdgeID": null }, { "edgeID": "317203", "fromID": "262802", "toID": "236608", "formEdgeID": null }, { "edgeID": "317204", "fromID": "236606", "toID": "262803", "formEdgeID": null }, { "edgeID": "317205", "fromID": "262803", "toID": "229577", "formEdgeID": null }, { "edgeID": "317206", "fromID": "262803", "toID": "262804", "formEdgeID": null }, { "edgeID": "317207", "fromID": "262804", "toID": "262802", "formEdgeID": null } ], "locutions": [] 
            };
            const expectedActions_SUCCESS = [
                {type: types.SET , variable:"nodes", payload: ["hello"]},
            ];
            
            const store = mockStore({ nodes:{}});

            let tree = d3.tree().size([1920 - 75, 1080]);

            let convertRawToTree = DataToTree.__get__('convertRawToTree');

            expect(DataToTree.__get__('linkHashBySource')).toEqual({});
            expect(DataToTree.__get__('linkHashByTarget')).toEqual({});
            expect(DataToTree.__get__('nodeHash')).toEqual({});
            expect(DataToTree.__get__('lowestNumOfLayers')).toEqual(0);
            expect(DataToTree.__get__('totalNumOfLayers')).toEqual(0);
            expect(DataToTree.__get__('possibleLoopHash')).toEqual({});
            expect(DataToTree.__get__('correctLoopHash')).toEqual({});
            expect(DataToTree.__get__('applyChildrenLoopHash')).toEqual({});
            expect(DataToTree.__get__('tree')).toEqual(tree);

            return store.dispatch(DataToTree.convertRawToTree(object)).then(()=>{
                expect(store.getActions()).toEqual(expectedActions_SUCCESS)
            });
        }); 

    }) 
    

    // function structureIntoTree(rootNodes){
    // }
    
    
    

    
    