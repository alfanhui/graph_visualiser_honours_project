import * as actions from 'reducerActions';
import * as types from 'constants/reducerActionTypes.js';

describe('actions', ()=>{
    console.log = jest.fn();
    it('should create an action to SET variable', ()=>{
        const variable = 'string'
        const payload = "Hello World"
        const expectedAction = {
            type: types.SET,
            variable,
            payload
        }
        expect(actions.SET(variable, payload)).toEqual(expectedAction)
    })
})

describe('actions', ()=>{
    console.log = jest.fn();
    it('should create an action to UPDATE item in variable', ()=>{
        const variable = 'string'
        const payload = "Hello World"
        const expectedAction = {
            type: types.UPDATE,
            variable,
            payload
        }
        expect(actions.UPDATE(variable, payload)).toEqual(expectedAction)
    })
})

describe('actions', ()=>{
    console.log = jest.fn();
    it('should create an action to REPLACE item in variable', ()=>{
        const variable = 'List_of_names'
        const payload = "Bob Smith"
        const id = "name"
        const expectedAction = {
            type: types.REPLACE,
            variable,
            id,
            payload
        }
        expect(actions.REPLACE(variable,id, payload)).toEqual(expectedAction)
    })
})

describe('actions', ()=>{
    console.log = jest.fn();
    it('should create an action to DROP item in variable', ()=>{
        const variable = 'List_of_names'
        const payload = "Bob Smith"
        const id = "name"
        const expectedAction = {
            type: types.DROP,
            variable,
            id,
            payload
        }
        expect(actions.DROP(variable,id, payload)).toEqual(expectedAction)
    })
})