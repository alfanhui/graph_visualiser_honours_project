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

describe('createDataHashes function', () => {
    beforeEach(()=>{
        
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
    
describe('calculatePossibleDepths function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        
    });
    
    it('calculatePossibleDepths on simple node graph', () => {
        
        const rootNodes = [{nodeID:"id1"}];
      
        const nodeHash = {"id1": {nodeID:"id1",depthArray:[]},
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
        
    
    let calculatePossibleDepths = DataToTree.__get__('calculatePossibleDepths');
    DataToTree.__set__('nodeHash', nodeHash);
    DataToTree.__set__('linkHashBySource', linkHashBySource);
    DataToTree.__set__('linkHashByTarget', linkHashByTarget);
    DataToTree.__set__('possibleLoopHash', {});

    return expect(calculatePossibleDepths(rootNodes)).toEqual(rootNodes);
});


    
    
    // export function convertRawToTree(object) { 
    // }
    
    
    //create hash of nodes, links by source and targets (speeds up search)
    // function createDataHashes(nodes, links){
    // }
    
    // function calculatePossibleDepths(rootNodes){
    // }
    
    // function getNodesWithMaxDepth(){
    // }
    
    //Recursively goes through and adds correct children to each node
    // function applyChildrenRecurssively(node, children){
    // }
    
    
    //adds suspected layer to depthLayer array
    // function possibleDepthTraversalRecurssively(nodeID, counter) {
    // }
    
    //Adjusts layer height based off maximum layer found in child
    // function correctDepthTraversalRecurssively(nodeID, counter) {
    // }
    
    //gets all the nodes that do not have parents
    // function getRootNodes(nodes) {
    // }
    
    
    //Because some graphs loop back on themselves, the layers can get into negative numbers. This adjusts this error.
    // function fixLayerCount(){
    // }
    
    // function structureIntoTree(rootNodes){
    // }
})