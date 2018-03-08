import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as dbconnection from 'utilities/DBConnection.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dbconnection async actions', () => {
    beforeEach(()=>{
        jest.mock('../__mocks__/superagent');
    });
    
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
        jest.mock('../__mocks__/superagent');
        //jest.resetModules();
    });
    it('updates connectionType to LOCAL when database URL succeeds', () => {
        const expectedActions_SUCCESS = [
            {type: types.SET , variable:"databaseError", payload: '#FFFFF'},
            {type: types.SET , variable:"connectionType", payload: 'local'}
        ];
        const store = mockStore({ databaseError: '', connectionType: ''});
        
        jest.mock('../__mocks__/superagent');

        return store.dispatch(dbconnection.checkAddress()).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS)
        });//.catch(e => {expect(e).toBeTruthy(); expect(store.getActions()).toEqual(expectedActions_FAILURE)});
    })
    
    it('updates connectionType to REMOTE when database URL fails', () => {
        const expectedActions_FAILURE = [
            {type: types.SET , variable:"databaseError", payload: '#FFFFF'},
            {type: types.SET , variable:"connectionType", payload: 'remote'}
        ];
        const store = mockStore({ databaseError: '', connectionType: ''})
        
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.auth = function(){return Promise.reject({});};  
        
        return store.dispatch(dbconnection.checkAddress()).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_FAILURE)
        });
    })
    
    it('returns data if no errors on postQuery', () => {
        const expectedResult_SUCCESS = [
            {"hello":"world"}
        ];
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            ok() { 
                return true; 
            },
            body: {errors:[], results:[{"hello":"world"}]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.resolve(myModule.__getMockResponse());};  
        
        const store = mockStore({ databaseError: ''})
        return store.dispatch(dbconnection.postQuery('returns data if no errors on postQuery')).then((data)=>{
            expect(data).toEqual(expectedResult_SUCCESS);
        });
    })

    it('returns error if error is present on postQuery', () => {
        const expectedResult_FAILURE = 0;
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            ok() { 
                return true; 
            },
            body: {errors:['An Error Occurred'], results:[{"hello":"world"}]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.resolve(myModule.__getMockResponse());};  
        
        const store = mockStore({ databaseError: ''})
        return store.dispatch(dbconnection.postQuery('returns data if no errors on postQuery')).then((data)=>{
            expect(data).toEqual(expectedResult_FAILURE);
        });
    })

    it('returns error database is down on postQuery', () => {
        const expectedResult_FAILURE = 0;
        
        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            body: {errors:[], results:[{"hello":"world"}]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.resolve(myModule.__getMockResponse());};  
        
        const store = mockStore({ databaseError: ''})
        return store.dispatch(dbconnection.postQuery('returns data if no errors on postQuery')).then((data)=>{
            expect(data).toEqual(expectedResult_FAILURE);
        });
    })

    it('successful wipe on wipedatabase', () => {
        const expectedActions_SUCCESS = [
            {type: types.SET , variable:"nodes", payload: []},
            {type: types.SET , variable:"links", payload: []},
            {type: types.SET , variable:"databaseError", payload: '#FFFFF'}
        ];

        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            ok() { 
                return true; 
            },
            body: {errors:[], results:[]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.resolve(myModule.__getMockResponse());};  
        
        const store = mockStore({ nodes: [{nodeID:1}, {nodeID:2}], links:[{edgeID:1}, {edgeId:2}], databaseError: ''})
        return store.dispatch(dbconnection.wipeDatabase()).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_SUCCESS);
        })
    })

    it('successful wipe of local if server is down on wipedatabase', () => {
        const expectedActions_FAILURE = [
            {type: types.SET , variable:"nodes", payload: []},
            {type: types.SET , variable:"links", payload: []},
            {type: types.SET , variable:"databaseError", payload: '#F50057'}
        ];

        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            body: {errors:[], results:[]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.reject(myModule.__getMockResponse());};  
        
        const store = mockStore({ nodes: [{nodeID:1}, {nodeID:2}], links:[{edgeID:1}, {edgeId:2}], databaseError: ''})
        return store.dispatch(dbconnection.wipeDatabase()).then(()=>{
            expect(store.getActions()).toEqual(expectedActions_FAILURE);
        })
    })

    it('successful on removeIndex', () => {
        const expectedActions_SUCCESS = [Promise.resolve({})];

        jest.unmock('../__mocks__/superagent');
        const myModule = require('../__mocks__/superagent');
        myModule.__setMockResponse({  
            status() { 
                return 200; 
            },
            ok() { 
                return true; 
            },
            body: {errors:[], results:[{data:[{row:["index1", "index2"]}]}]},
            get: jest.genMockFunction(),
            toError: jest.genMockFunction()
        });  
        myModule.auth = function(){return Promise.resolve(myModule.__getMockResponse());};  


        const store = mockStore({ databaseError: ''})
        return store.dispatch(dbconnection.removeIndexes()).then((data)=>{
            expect(data).toEqual(expectedActions_SUCCESS);
        });
    })
})