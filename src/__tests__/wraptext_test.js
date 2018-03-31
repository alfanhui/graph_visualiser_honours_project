import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import {wrapContextTextToArray, wrapNonContextTextToArray} from 'utilities/WrapText';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('WrapText function', () => {
    beforeEach(()=>{
        
    });
    
    afterEach(() => {
        
    });
    console.log = jest.fn();
    it('string with nothing passes wrapContextTextToArray', () => {
        return expect(wrapContextTextToArray("")).toEqual([""]);
    });   
    
    it('string with nothing passes wrapNonContextTextToArray', () => {
        return expect(wrapNonContextTextToArray("")).toEqual([""]);
    });   

    it('string with 10 chars passes wrapContextTextToArray', () => {
        return expect(wrapContextTextToArray("abcdefghij")).toEqual(["abcdefghij"]);
    }); 
    
    it('string with 10 chars passes wrapNonContextTextToArray', () => {
        return expect(wrapNonContextTextToArray("abcdefghij")).toEqual(["abcdefghij"]);
    }); 

    it('string with 31 chars passes wrapContextTextToArray without splitting last word', () => {
        return expect(wrapContextTextToArray("aaaaaa aaaaaaaa aaaaaa aaaaaaaa")).toEqual(["aaaaaa aaaaaaaa aaaaaa", "aaaaaaaa"]);
    }); 

    it('string with a 31 long word passes wrapContextTextToArray splitting last letter', () => {
        return expect(wrapContextTextToArray("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","a"]);
    });

    it('string with words are seperated when passed to wrapNonContextTextToArray', () => {
        return expect(wrapNonContextTextToArray("hello how are you?")).toEqual(["hello", "how", "are", "you?"]);
    });  
})

