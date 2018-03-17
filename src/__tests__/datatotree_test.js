import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as datatotree from 'utilities/DataToTree.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';
let DataToTree = require('utilities/DataToTree');

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
        
    })
    





    
    
    
    // export function convertRawToTree(object) { 
    // }
    

    
    //gets all the nodes that do not have parents
    // function getRootNodes(nodes) {
    // }
    
    
    //Because some graphs loop back on themselves, the layers can get into negative numbers. This adjusts this error.
    // function fixLayerCount(){
    // }
    
    // function structureIntoTree(rootNodes){
    // }
    