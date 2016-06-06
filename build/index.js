"use strict";
var store_1 = require('./store');
var App_1 = require('./App');
var ReactDOM = require('react-dom');
var actions_1 = require('./actions');
var React = require('react');
store_1.state.subscribe(function (state) {
    return ReactDOM.render(React.createElement(App_1.App, {events: actions_1.events, state: state}), document.getElementById('container'));
});
store_1.hashChanges.subscribe(function (hash) {
    if (hash || window.location.hash) {
        window.location.hash = hash;
    }
});
//# sourceMappingURL=index.js.map