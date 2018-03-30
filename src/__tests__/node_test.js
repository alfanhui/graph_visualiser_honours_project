import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import Node from 'utilities/Node.js';

import {wrapContextTextToArray, wrapNonContextTextToArray} from 'utilities/WrapText';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Node function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        
    });
    
    it('New Node object returned given menu nodeData and isContext true', () => {
        
        let menu = {
            "x": 10,
            "y": 20,
            "uuid":"node_id"
        },
        nodeData ={
            "type": "A",
            "text": "Hello, how are you? I hope you are well."
        },
        isContext = true;
        
        let expectedResult = {
            "nodeID": "node_i",
            "type": "A",
            "x": 10,
            "y": 20,
            "layer":0,
            "text": ["Hello, how are you? I hope you", "are well."],
            "timestamp": "",
            "date": "",
            "time": ""
        }
        let newNode = new Node(menu, nodeData, isContext);

        expect(newNode['nodeID']).toEqual(expectedResult.nodeID);
        expect(newNode['text']).toEqual(expectedResult.text);
        expect(newNode['text']).toEqual(expectedResult.text);
        return 
    });

    it('New Node object returned given menu nodeData and isContext false', () => {
        
        let menu = {
            "x": 10,
            "y": 20,
            "uuid":"node_id"
        },
        nodeData ={
            "type": "B",
            "text": "non content"
        },
        isContext = true;
        
        let expectedResult = {
            "nodeID": "node_i",
            "type": "B",
            "x": 10,
            "y": 20,
            "layer":0,
            "text": ["non content"],
            "timestamp": "",
            "date": "",
            "time": ""
        }
        let newNode = new Node(menu, nodeData, isContext);

        expect(newNode['nodeID']).toEqual(expectedResult.nodeID);
        expect(newNode['text']).toEqual(expectedResult.text);
        expect(newNode['text']).toEqual(expectedResult.text);
        return 
    });
    
})