import jsdom from 'jsdom';

const {JSDOM} = jsdom;
const {window} = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>');

//сopy window globals to Jest global scope
function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
            .filter(prop => typeof target[prop] === 'undefined')
            .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
}
global.document = window;
global.window = window.parentWindow;
global.navigator = {
    userAgent: 'node.js',
};

copyProps(window, global);

// Fail tests on any warning
console.error = message => {
    throw new Error(message);
};