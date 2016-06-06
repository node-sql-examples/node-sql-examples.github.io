"use strict";
var React = require('react');
var Highlight = require('react-highlight');
var Search = function (p) {
    return React.createElement("div", {className: "search"}, React.createElement("input", {autoFocus: true, placeholder: "Search...", type: "text", onChange: p.onChange}), React.createElement("select", {value: p.dialect, onChange: p.setDialect}, React.createElement("option", {value: "pg"}, "PostgreSQL"), React.createElement("option", {value: "mysql"}, "MySQL"), React.createElement("option", {value: "sqlite"}, "SQLite"), React.createElement("option", {value: "mssql"}, "MS SQL"), React.createElement("option", {value: "oracle"}, "Oracle")));
};
var match = function (text, entry) {
    return entry && entry.toLowerCase().indexOf(text) >= 0;
};
exports.App = function (_a) {
    var _b = _a.events, change = _b.change, toggle = _b.toggle, setDialect = _b.setDialect, state = _a.state;
    return React.createElement("div", {className: "app"}, React.createElement(Search, {onChange: change, dialect: state.filter.dialect, setDialect: setDialect}), React.createElement(Categories, {items: state.categories, filter: state.filter, onToggle: toggle}));
};
var Category = function (_a) {
    var data = _a.data, onToggle = _a.onToggle, filter = _a.filter;
    var shownItems = data.entries.filter(function (entry) { return match(filter.text, entry[filter.dialect]); });
    var showCategoryName = shownItems.length > 0;
    var showCategory = data.shown || (filter.text.length > 0 && shownItems.length > 0);
    if (!showCategoryName)
        return null;
    return React.createElement("div", {className: "category"}, React.createElement("label", {for: data.name, class: "name"}, React.createElement("input", {type: "checkbox", id: data.name, checked: data.shown, onChange: function (e) { return onToggle(data.name); }}), React.createElement("span", null), React.createElement("span", {className: "name"}, data.name)), showCategory ?
        React.createElement("div", {className: "entries"}, shownItems.map(function (item) { return React.createElement(Entry, {sql: item[filter.dialect], js: item.query}); }))
        : null);
};
var Categories = function (_a) {
    var items = _a.items, onToggle = _a.onToggle, filter = _a.filter;
    return React.createElement("div", {className: "categories"}, Object.keys(items).map(function (name) { return React.createElement(Category, {data: items[name], onToggle: onToggle, filter: filter}); }));
};
var Entry = function (_a) {
    var sql = _a.sql, js = _a.js;
    return React.createElement("div", {className: "entry"}, React.createElement(Highlight, {className: "sql"}, sql), React.createElement(Highlight, {className: "js"}, js));
};
//# sourceMappingURL=App.js.map