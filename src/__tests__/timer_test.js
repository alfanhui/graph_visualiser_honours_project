import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import {startTimer, addToTimer, stopTimer} from 'utilities/Timer.js';
import * as types from 'constants/reducerActionTypes.js';

let Timer = require('utilities/Timer');


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Timer function', () => {
    beforeEach(()=>{
        jest.resetModules();
    });
    
    afterEach(() => {
        
    });

    test('check start timer to update then drop after timer completes', () => {

        let menu = {
            uuid:"123456",
            type:'main'
        }
        
        let expectedActions = [
            {type: types.UPDATE, variable: "main", payload: menu}, 
            {type: types.DROP, id: "uuid", payload: {uuid: "123456"}, variable: "main"}
        ];

        const store = mockStore({ });
        store.dispatch(startTimer(menu));
        jest.runAllTimers();
   
        //store.dispatch(stopTimer(menu.uuid, menu.type));
        return expect(store.getActions()).toEqual(expectedActions);
   
      });


      test('addToTimer function only runs stopTimer once', () => {

        let menu = {
            uuid:"123456",
            type:'main'
        }
        
        let expectedActions = [
            {type: types.UPDATE, variable: "main", payload: menu}, 
            {type: types.DROP, id: "uuid", payload: {uuid: "123456"}, variable: "main"}
        ];

        const store = mockStore({ });
        store.dispatch(startTimer(menu));
        store.dispatch(addToTimer(menu.uuid, menu.type));
        jest.runAllTimers();
   
        //store.dispatch(stopTimer(menu.uuid, menu.type));
        return expect(store.getActions()).toEqual(expectedActions);
   
      });


      test('multiple start timers can be created at once which will all drop after timer completes', () => {

        let menu0 = {
            uuid:"123456",
            type:'main'
        },
        menu1 = {
            uuid:"345678",
            type:'element'
        },
        menu2 = {
            uuid:"234567",
            type:'main'
        };

        let expectedActions = [
            {type: types.UPDATE, variable: "main", payload: menu0}, 
            {type: types.UPDATE, variable: "element", payload: menu1}, 
            {type: types.UPDATE, variable: "main", payload: menu2}, 
            {type: types.DROP, id: "uuid", payload: {uuid: "123456"}, variable: "main"},
            {type: types.DROP, id: "uuid", payload: {uuid: "345678"}, variable: "element"},
            {type: types.DROP, id: "uuid", payload: {uuid: "234567"}, variable: "main"}
        ];

        const store = mockStore({ });
        store.dispatch(startTimer(menu0));
        store.dispatch(startTimer(menu1));
        store.dispatch(startTimer(menu2));
        jest.runAllTimers();
   
        //store.dispatch(stopTimer(menu.uuid, menu.type));
        return expect(store.getActions()).toEqual(expectedActions);
   
      });

      test('double checking order of events when timer one menu finishes before starting a new one', () => {

        let menu0 = {
            uuid:"123456",
            type:'main'
        },
        menu1 = {
            uuid:"345678",
            type:'element'
        };

        let expectedActions = [
            {type: types.UPDATE, variable: "main", payload: menu0}, 
            {type: types.DROP, id: "uuid", payload: {uuid: "123456"}, variable: "main"},
            {type: types.UPDATE, variable: "element", payload: menu1},
            {type: types.DROP, id: "uuid", payload: {uuid: "345678"}, variable: "element"},
        ];

        const store = mockStore({ })
        store.dispatch(startTimer(menu0));
        jest.runAllTimers();
        store.dispatch(startTimer(menu1));
        jest.runAllTimers();     
   
        //store.dispatch(stopTimer(menu.uuid, menu.type));
        return expect(store.getActions()).toEqual(expectedActions);
   
      });

})