"use strict";
var util_1 = require('./util');
var actions_1 = require('./actions');
var rx_with_dom_1 = require('./rx-with-dom');
var dialects = actions_1.actions.dialects, filters = actions_1.actions.filters, toggles = actions_1.actions.toggles, dataReceived = actions_1.actions.dataReceived;
var dialectMutator = dialects
    .map(function (dialect) { return function (s) { return util_1.assign(s, { filter: util_1.assign(s.filter, { dialect: dialect }) }); }; });
var filterMutators = filters
    .map(function (text) { return function (s) { return util_1.assign(s, { filter: util_1.assign(s.filter, { text: text }) }); }; });
var categoryMutator = dataReceived
    .map(function (cats) { return function (s) { return util_1.assign(s, { categories: cats }); }; });
var stateMutators = toggles.merge(dialectMutator).merge(filterMutators).merge(categoryMutator);
var initialState = {
    categories: {},
    filter: {
        text: '',
        dialect: 'pg'
    }
};
exports.state = stateMutators
    .scan(function (acc, mutator) { return mutator(acc); }, initialState);
var mkHash = function (d, f) {
    return '#dialect=' + encodeURIComponent(d) + '&query=' + encodeURIComponent(f);
};
exports.hashChanges = rx_with_dom_1.Observable.combineLatest(dialects, filters, function (d, f) {
    return d == 'pg' && f == '' ? '' : mkHash(d, f);
});
//# sourceMappingURL=store.js.map