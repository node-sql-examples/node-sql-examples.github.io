"use strict";
var React = require('react');
var Rx = require('rx');
var rx_dom_ajax_1 = require('rx-dom-ajax');
var func_subject_1 = require('./func-subject');
var ReactDOM = require('react-dom');
Rx.DOM = rx_dom_ajax_1.Rx.DOM;
function assign(obj, assignments) {
    return Object.assign({}, obj, assignments);
}
function assignDict(d, key, t) {
    return Object.assign({}, d, (_a = {}, _a[key] = t, _a));
    var _a;
}
var Search = function (p) {
    return React.createElement("div", {className: "search"}, React.createElement("input", {autoFocus: true, placeholder: "Search...", type: "text", onChange: p.onChange}), React.createElement("select", {value: p.dialect, onChange: p.setDialect}, React.createElement("option", {value: "pg"}, "PostgreSQL"), React.createElement("option", {value: "mysql"}, "MySQL"), React.createElement("option", {value: "sqlite"}, "SQLite"), React.createElement("option", {value: "mssql"}, "MS SQL"), React.createElement("option", {value: "oracle"}, "Oracle")));
};
var match = function (text, entry) {
    return entry && entry.toLowerCase().indexOf(text) >= 0;
};
var App = function (p) {
    return React.createElement("div", {className: "app"}, React.createElement(Search, {onChange: p.events.change, dialect: p.state.filter.dialect, setDialect: p.events.setDialect}), React.createElement(Categories, {items: p.state.categories, filter: p.state.filter, onToggle: p.events.toggle}));
};
var Categories = function (p) {
    return React.createElement("div", {className: "categories"}, Object.keys(p.items).map(function (name) { return React.createElement(Category, {data: p.items[name], onToggle: p.onToggle, filter: p.filter}); }));
};
var Category = function (p) {
    var shownItems = p.data.entries.filter(function (entry) { return match(p.filter.text, entry[p.filter.dialect]); });
    var showCategoryName = shownItems.length > 0;
    var showCategory = p.data.shown || (p.filter.text.length > 0 && shownItems.length > 0);
    if (!showCategoryName)
        return null;
    return React.createElement("div", {className: "category"}, React.createElement("label", {for: p.data.name, class: "name"}, React.createElement("input", {type: "checkbox", id: p.data.name, checked: p.data.shown, onChange: function (e) { return console.log("Toggle") || p.onToggle({ e: e, name: p.data.name }); }}), React.createElement("span", null), React.createElement("span", {className: "name"}, p.data.name)), showCategory ?
        React.createElement("div", {className: "entries"}, shownItems.map(function (item) { return React.createElement(Entry, {sql: item[p.filter.dialect], js: item.query}); }))
        : null);
};
var Entry = function (p) {
    return React.createElement("div", {className: "entry"}, React.createElement("pre", {className: "sql"}, p.sql), React.createElement("pre", {className: "js"}, p.js));
};
var events = {
    change: func_subject_1.default(),
    setDialect: func_subject_1.default(),
    toggle: func_subject_1.default()
};
var toggles = events.toggle.events.map(function (_a) {
    var any = _a.e, string = _a.name;
    return function (s) { return assign(s, {
        categories: assignDict(s.categories, name, assign(s.categories[name], {
            shown: !s.categories[name].shown
        }))
    }); };
});
var urlHash = window.location.hash.split('&').reduce(function (acc, el) {
    var _a = el.split('=').map(decodeURIComponent), key = _a[0], val = _a[1];
    acc[key] = val;
    return acc;
}, {});
var dialects = Rx.Observable.return(urlHash['dialect'] || 'pg')
    .merge(events.setDialect.events.map(function (e) { return e.target.value; }));
var dialectMutator = dialects.map(function (dialect) {
    return function (s) { return assign(s, { filter: assign(s.filter, { dialect: dialect }) }); };
});
var filters = Rx.Observable.return(urlHash['query'] || '')
    .merge(events.change.events.map(function (e) { return e.target.value; }).debounce(500));
var filterMutators = filters.map(function (text) { return function (s) { return assign(s, { filter: assign(s.filter, { text: text }) }); }; });
var stateMutators = toggles.merge(dialectMutator).merge(filterMutators);
var hashChanges = Rx.Observable.combineLatest(dialects, filters, function (d, f) {
    return d == 'pg' && f == '' ? '' : '#' +
        'dialect=' + encodeURIComponent(d) + '&query=' + encodeURIComponent(f);
});
hashChanges.subscribe(function (hash) { if (hash || window.location.hash)
    window.location.hash = hash; });
function mkCategories(data) {
    var cats = {};
    Object.keys(data).forEach(function (key) {
        cats[key] = { shown: false, name: key, entries: data[key] };
    });
    return cats;
}
var dataArrival = Rx.DOM.getJSON('/data.json')
    .map(mkCategories)
    .map(function (cats) { return function (s) { return assign(s, { categories: cats }); }; });
var state = dataArrival.merge(stateMutators).scan(function (acc, mutator) { return mutator(acc); }, {
    categories: {},
    filter: {
        text: '',
        dialect: 'pg'
    }
});
state.subscribe(function (state) {
    return ReactDOM.render(React.createElement(App, {events: events, state: state}), document.getElementById('container'));
});
//# sourceMappingURL=Page.js.map