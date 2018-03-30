import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import {makeEdge} from 'utilities/Edge.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Edge function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        
    });
    
    it('Edge returns edgeObject from source and target objects', () => {
        
        let source = {
            "nodeID": "id1",
            "type": "A"
        },
        target ={
            "nodeID": "id2",
            "type": "A"
        };
        
        let expectedResult = {
            edgeID:"012345",
            formEdgeID:"null",
            fromID:"id1",
            source:"id1",
            fromType:"A",
            toID:"id2",
            target:"id2",
            toType:"A"
        }
        
        return expect(makeEdge(source, target)).toEqual(expectedResult);
    });
    
})