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
                {"children": [{"children": [], "depthArray": [], "nodeID": "id4", "parent": "id2"}, {"children": [], "depthArray": [], "nodeID": "id5", "parent": "id2"}], "depthArray": [], "nodeID": "id2", "parent": "id1"}, 
                {"children": [], "depthArray": [], "nodeID": "id3", "parent": "id1"}]
                
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
            
            it('Returns one loop node and normal root nodes only', () => {
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
                    {nodeID:"id4"}, 
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
                    {nodeID:"id3", timestamp:"2016-11-08 18:14:13"},
                    {nodeID:"id4", timestamp:"2016-11-08 18:14:14"}                              
                ];
                
                let getRootNodes = DataToTree.__get__('getRootNodes');
                DataToTree.__set__('linkHashByTarget', linkHashByTarget);
                return expect(getRootNodes(nodes)).toEqual(expectedRootNodes);
            });
            
            it('Returns one node from each of the 2 loops as no root nodes availiable', () => {
                const nodes = [
                    {nodeID:"id1"},
                    {nodeID:"id2"},
                    {nodeID:"id3"},
                    {nodeID:"id4"},
                ], linkHashByTarget = {
                    "id1":[{source:"id3", target:"id1"}],
                    "id2":[{source:"id4", target:"id2"}],
                    "id3":[{source:"id1", target:"id3"}],
                    "id4":[{source:"id2", target:"id4"}],
                };
                
                const expectedRootNodes = [
                    {nodeID:"id2"}, 
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
            
            it('if layers have shifted negatively (-) past 0', () => {
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
            
            it('if layers have shifted positively (+) past 0', () => {
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
                    "nodes": [ 
                        { "nodeID": "229463", "type": "C", "timestamp":"2018-03-30 17:03:66"},
                        { "nodeID": "229462", "type": "B", "timestamp":"2018-03-30 17:03:66"},
                        { "nodeID": "229461", "type": "L", "timestamp":"2018-03-30 17:03:66" }
                    ], 
                    "links": [ 
                        { "edgeID": "317190", "fromID": "229461", "toID": "229462", "formEdgeID": null }, 
                        { "edgeID": "317191", "fromID": "229461", "toID": "229463", "formEdgeID": null }
                    ], 
                    "locutions": [] 
                };
                
                
                const expectedNewNodes = [
                    {"layer": 0, "nodeID": "229463", "text": "", "timestamp": "2018-03-30 17:03:66", "type": "C", "x": 87.5, "y": 20}, 
                    {"layer": 0, "nodeID": "229462", "text": "", "timestamp": "2018-03-30 17:03:66", "type": "B", "x": 262.5, "y": 20}, 
                    {"layer": 0, "nodeID": "229461", "text": "", "timestamp": "2018-03-30 17:03:66", "type": "L", "x": 437.5, "y": 20}];
                
                
                const expectedActions = [
                    {type: types.SET , variable:"layoutReady", payload: true},
                    {type: types.SET , variable:"nodes", payload: expectedNewNodes}
                ];
                
                
                
                const store = mockStore({ nodes:{}});
                
                let tree = d3.tree().size([600- 75, 400]);
                
                //setup the global variables
                let convertRawToTree = DataToTree.__get__('convertRawToTree');
                DataToTree.__set__('nodeHash', {});
                DataToTree.__set__('linkHashBySource', {});
                DataToTree.__set__('linkHashByTarget', {});
                DataToTree.__set__('lowestNumOfLayers', 0);
                DataToTree.__set__('totalNumOfLayers', 0);
                DataToTree.__set__('possibleLoopHash', {});
                DataToTree.__set__('correctLoopHash', {});
                DataToTree.__set__('applyChildrenLoopHash', {});
                DataToTree.__set__('tree', tree);
                
                store.dispatch(datatotree.convertRawToTree(object))
                return expect(store.getActions()).toEqual(expectedActions);
            }); 
            
        }) 
        

        // function structureIntoTree(rootNodes){     
        describe('structureIntoTree function', () => {
            beforeEach(()=>{
                
            });
            
            afterEach(() => {
                
            });        
            
            it('Outputs correct tree structure', () => {
                const nodeHash = {
                    "id1": {nodeID:"id1"},
                    "id2": {nodeID:"id2"},
                    "id3": {nodeID:"id3"},
                    "id4": {nodeID:"id4"},
                    "id5": {nodeID:"id5"}
                },
                linkHashBySource = {
                    "id1":[{source:"id1", target:"id2"},{source:"id1", target:"id3"}],
                    "id2":[{source:"id2", target:"id4"},{source:"id2", target:"id5"}]
                },
                rootNodes = [
                    {nodeID:"id1"}
                ];

                let expectedDataTree =  {
                    "name": "TopLevel",
                    "children": [{
                        "nodeID": "id1", 
                        "parent": "",
                        "children": [{
                            "nodeID": "id2", 
                            "parent": "id1",
                            "children": [{
                                "nodeID": "id4", 
                                "parent": "id2",
                                "children": [] 
                            }, {
                                "nodeID": "id5", 
                                "parent": "id2",
                                "children": [] 
                            }]
                        }, {
                            "nodeID": "id3", 
                            "parent": "id1",
                            "children": []
                        }]
                    }]
                };


                let structureIntoTree = DataToTree.__get__('structureIntoTree');
                DataToTree.__set__('nodeHash', nodeHash);
                DataToTree.__set__('linkHashBySource', linkHashBySource);
                DataToTree.__set__('totalNumOfLayers', 4);
                return expect(structureIntoTree(rootNodes)).toEqual(expectedDataTree);
            });  
            
    
        }) 

           //This converts the hierarchal data of all the root nodes and their children back into normal node data.  
        //function treeIntoNodes(root){        
            describe('treeIntoNodes function', () => {
                beforeEach(()=>{
                    
                });
                
                afterEach(() => {
                    
                });        
                
                it('return nodes for visualising for screen of 600x400 without text property', () => {
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
                    }, 
                    dataTree =  {
                        "name": "TopLevel",
                        "children": [{
                            "nodeID": "id1",
                            "y": 40,
                            "parent": "",
                            "timestamp": "2018-03-30 16:03:11",
                            "children": [{
                                "nodeID": "id2", 
                                "parent": "id1",
                                "y": 20,
                                "timestamp": "2018-03-30 16:03:11",
                                "children": [{
                                    "nodeID": "id4", 
                                    "parent": "id2",
                                    "y": 30,
                                    "timestamp": "2018-03-30 16:03:11",
                                    "children": [] 
                                }, {
                                    "nodeID": "id5", 
                                    "parent": "id2",
                                    "y": 0,
                                    "timestamp": "2018-03-30 16:03:11",
                                    "children": [] 
                                }]
                            }, {
                                "nodeID": "id3", 
                                "parent": "id1",
                                "y": 80,
                                "timestamp": "2018-03-30 16:03:11",
                                "children": []
                            }]
                        }]
                    };

                    let expectedNewNodes = [
                        {"nodeID": "id4", "text": "", "timestamp": "2018-03-30 16:03:11", "x": 150, "y": 30}, 
                        {"nodeID": "id5", "text": "", "timestamp": "2018-03-30 16:03:11", "x": 300, "y": 0}, 
                        {"nodeID": "id2", "text": "", "timestamp": "2018-03-30 16:03:11", "x": 225, "y": 20}, 
                        {"nodeID": "id3", "text": "", "timestamp": "2018-03-30 16:03:11", "x": 375, "y": 80}, 
                        {"nodeID": "id1", "text": "", "timestamp": "2018-03-30 16:03:11", "x": 300, "y": 40}
                    ];

                    let tree = d3.tree().size([600 - 75, 400]);
                    let root = tree(d3.hierarchy(dataTree));
    
                    let treeIntoNodes = DataToTree.__get__('treeIntoNodes');
                    DataToTree.__set__('nodeHash', nodeHash);
                    DataToTree.__set__('lowestNumOfLayers', 0);
                    DataToTree.__set__('totalNumOfLayers', 4);
                
                    return expect(treeIntoNodes(root)).toEqual(expectedNewNodes);
                });  
                
        
            }) 
           //This converts the hierarchal data of all the root nodes and their children back into normal node data.  
        //function (){        
            describe('checkForDisconnectedLoopedNodes function', () => {
                beforeEach(()=>{
                    
                });
                
                afterEach(() => {
                    
                });        
                
                it('Successfully applies one of the node in a loop to rootNodes', () => {
                    const nodeHash = {
                        "id1": {nodeID:"id1"},
                        "id2": {nodeID:"id2"},
                        "id3": {nodeID:"id3"},
                        "id4": {nodeID:"id4"},
                    },
                    linkHashByTarget = {
                        "id3":[{source:"id2", target:"id3"}],
                        "id4":[{source:"id3", target:"id4"}],
                        "id2":[{source:"id4", target:"id2"}]
                    }, 
                    rootNodes = [
                        {nodeID:"id1"}
                    ],
                    connectedNodes = [
                        {nodeID:"id2"},
                        {nodeID:"id3"},
                        {nodeID:"id4"}
                    ];
                    
                    let expectedRootNodes = [
                        {nodeID:"id1"},
                        {nodeID:"id2"}
                    ];

        
                    let checkForDisconnectedLoopedNodes = DataToTree.__get__('checkForDisconnectedLoopedNodes');
                    DataToTree.__set__('nodeHash', nodeHash);
                    DataToTree.__set__('linkHashByTarget', linkHashByTarget);                
                    return expect(checkForDisconnectedLoopedNodes(connectedNodes, rootNodes)).toEqual(expectedRootNodes);
                });  
                
                it('Successfully applies one of the node of multiple seperate loops to rootNodes', () => {
                    const nodeHash = {
                        "id1": {nodeID:"id1"},
                        "id2": {nodeID:"id2"},
                        "id3": {nodeID:"id3"},
                        "id4": {nodeID:"id4"},
                        "id5": {nodeID:"id5"},
                        "id6": {nodeID:"id6"},
                        "id7": {nodeID:"id7"},

                    },
                    linkHashByTarget = {
                        "id3":[{source:"id2", target:"id3"}],
                        "id4":[{source:"id3", target:"id4"}],
                        "id2":[{source:"id4", target:"id2"}],
                        "id6":[{source:"id5", target:"id6"}],
                        "id7":[{source:"id6", target:"id7"}],
                        "id5":[{source:"id7", target:"id5"}]
                    }, 
                    rootNodes = [
                        {nodeID:"id1"}
                    ],
                    connectedNodes = [
                        {nodeID:"id2"},
                        {nodeID:"id3"},
                        {nodeID:"id4"},
                        {nodeID:"id5"},
                        {nodeID:"id6"},
                        {nodeID:"id7"}
                    ];
                    
                    let expectedRootNodes = [
                        {nodeID:"id1"},
                        {nodeID:"id2"},
                        {nodeID:"id5"}
                    ];

        
                    let checkForDisconnectedLoopedNodes = DataToTree.__get__('checkForDisconnectedLoopedNodes');
                    DataToTree.__set__('nodeHash', nodeHash);
                    DataToTree.__set__('linkHashByTarget', linkHashByTarget);                
                    return expect(checkForDisconnectedLoopedNodes(connectedNodes, rootNodes)).toEqual(expectedRootNodes);
                }); 

                it('Passes same rootNodes back if no loops', () => {
                    const nodeHash = {
                        "id1": {nodeID:"id1"},
                        "id2": {nodeID:"id2"},
                        "id3": {nodeID:"id3"},
                        "id4": {nodeID:"id4"},
                    },
                    linkHashByTarget = {
                        "id3":[{source:"id2", target:"id3"}],
                        "id4":[{source:"id1", target:"id4"}],
                    }, 
                    rootNodes = [
                        {nodeID:"id1"},
                        {nodeID:"id2"}
                    ],
                    connectedNodes = [
                        {nodeID:"id1"},
                        {nodeID:"id2"},
                        {nodeID:"id3"},
                        {nodeID:"id4"},
                    ];
                            
                    let checkForDisconnectedLoopedNodes = DataToTree.__get__('checkForDisconnectedLoopedNodes');
                    DataToTree.__set__('nodeHash', nodeHash);
                    DataToTree.__set__('linkHashByTarget', linkHashByTarget);                
                    return expect(checkForDisconnectedLoopedNodes(connectedNodes, rootNodes)).toEqual(rootNodes);
                }); 

        
            }) 





    