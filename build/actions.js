"use strict";
var func_subject_1 = require('./func-subject');
var util_1 = require('./util');
var rx_with_dom_1 = require('./rx-with-dom');
exports.events = {
    change: func_subject_1.default(),
    setDialect: func_subject_1.default(),
    toggle: func_subject_1.default()
};
var toggles = exports.events.toggle.events.map(function (name) {
    return function (s) { return util_1.assign(s, {
        categories: util_1.assignDict(s.categories, name, util_1.assign(s.categories[name], {
            shown: !s.categories[name].shown
        }))
    }); };
});
var urlHash = window.location.hash.replace(/^#/, '').split('&').reduce(function (acc, el) {
    var _a = el.split('=').map(decodeURIComponent), key = _a[0], val = _a[1];
    acc[key] = val;
    return acc;
}, {});
var dialects = rx_with_dom_1.Observable.return(urlHash['dialect'] || 'pg')
    .merge(exports.events.setDialect.events.map(function (e) { return e.target.value; }));
var filters = rx_with_dom_1.Observable.return(urlHash['query'] || '')
    .merge(exports.events.change.events.map(function (e) { return e.target.value; }).debounce(500));
var mkCategories = function (data) {
    var cats = {};
    Object.keys(data).forEach(function (key) {
        cats[key] = { shown: false, name: key, entries: data[key] };
    });
    return cats;
};
var dataReceived = rx_with_dom_1.DOM.getJSON('/data.json').map(mkCategories);
exports.actions = { dialects: dialects, filters: filters, dataReceived: dataReceived, toggles: toggles };
//# sourceMappingURL=actions.js.map