import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as dbconnnection from 'utilities/DBConnection.js'
import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';
import fetchMock from 'fetch-mock';
import expect from 'expect';
const config = require('../config.js')['development'];

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


const mockResponse = (status, statusText, response) =>{
    return new window.Response(response, {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};

describe('dbconnection async actions', () => {
    afterEach(() => {
        fetchMock.reset();
        fetchMock.restore();
        delete(process.env.NODE_ENV);
    });

    beforeEach(()=>{

    });


    it('updates connectionType when checking available database URL', () => {
        process.env.NODE_ENV = 'development';

        const expectedActions_SUCCESS = [
            {type: types.SET , variable:"databaseError", payload: '#FFFFF'},
            {type: types.SET , variable:"connectionType", payload: 'local'}
        ];

        const expectedActions_FAILURE = [
            {type: types.SET , variable:"databaseError", payload: '#FFFFF'},
            {type: types.SET , variable:"connectionType", payload: 'remote'}
        ];
        const store = mockStore({ databaseError: '', connectionType: ''})

        return store.dispatch(dbconnnection.checkAddress()).then(()=>{
             expect(store.getActions()).toEqual(expectedActions_SUCCESS)
        }).catch(e => {expect(e).toBeTruthy(), expect(store.getActions()).toEqual(expectedActions_FAILURE)});
    })
})