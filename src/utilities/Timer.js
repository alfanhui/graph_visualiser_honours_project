import { UPDATE, REPLACE, DROP } from 'reducerActions';

let timeDelay = 4500;
/*
The purpose of the interalArray:
the timerId can change for the same menu
I need to keep track of the newId to be 
able to cancel if the menu's time is extended.

*/
let internalHash = {};

export function startTimer(menu) {
    //console.log("starting timer");
    return (dispatch) => {
        let object = {uuid:menu.uuid, type:menu.type};
        let timerId = setTimeout((object) => { dispatch(stopTimer(object.uuid, object.type)) }, timeDelay, object);
        internalHash[menu.uuid] = timerId;
        dispatch(UPDATE(menu.type, menu));
    };
}

//I add more because the menu is actively being used so more time should be added
export function addToTimer(uuid, type) {
    return (dispatch) => {
        let object = {uuid, type};
        clearTimeout(internalHash[uuid]); //Stop timer
        let newTimerId = setTimeout((object) => { dispatch(stopTimer(object.uuid, object.type)) }, timeDelay+2000, object); 
        internalHash[uuid]=newTimerId;
    };
}

export function stopTimer(uuid, type) {
    return (dispatch) => {
        clearTimeout(internalHash[uuid]); //Stop timer
        delete internalHash[uuid];
        dispatch(DROP(type,"uuid", uuid));
    };
}