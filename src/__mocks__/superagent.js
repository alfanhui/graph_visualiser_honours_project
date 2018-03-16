/*
* Code written by Andrew Ralston on 17th of April 2015 on Github
* https://github.com/facebook/jest/issues/223
*/

'use strict';

//mock for superagent - __mocks__/superagent.js

var mockDelay;
var mockError;
var mockResponse = {
  status() { 
    return 200; 
  },
  ok() { 
     return true; 
  },
  get: jest.genMockFunction(),
  toError: jest.genMockFunction()
};

var Request = {
  post() {
    return this;
  },
  get() {
    return this;
  },
  send() {
    return this;
  },
  query() {
    return this;
  },
  field() {
    return this;
  },
  set() {
    return this;
  },
  accept() {
    return this;
  },
  timeout() {
    return this;
  },
  auth(){
    return Promise.resolve(mockResponse);
  },
  end: jest.genMockFunction().mockImplementation(function(callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);
      return;
    }
    
    callback(mockError, mockResponse);
  }),
  //expose helper methods for tests to set
  __setMockDelay(boolValue) {
    mockDelay = boolValue;
  },
  __setMockResponse(mockRes) {
    mockResponse = mockRes;
  },
  __setMockError(mockErr) {
    mockError = mockErr;
  },

    //expose helper methods for tests to set
    __getMockDelay() {
      return mockDelay;
    },
    __getMockResponse() {
      return mockResponse;
    },
    __gettMockError() {
      return mockError;
    }
};




module.exports = Request;