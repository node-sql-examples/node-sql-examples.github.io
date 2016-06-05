import * as React from 'react'
import * as Rx from 'rx'
import * as Rxx from 'rx-dom-ajax'
import funcSubject from './func-subject'
import * as ReactDOM from 'react-dom'

declare var require:any;

var Highlight = require('react-highlight')

Rx.DOM = (Rxx as any).Rx.DOM;

interface Entry {
    category: string
    query: string
    [dialect:string]: string;
}

interface Category {
    name: string
    shown: boolean;
    entries: Entry[]
}

interface State {
    categories: {
        [name: string]: Category;
    }
    filter: Filter;
}
interface Filter {
    text: string
    dialect: string
}

function assign<T, U extends T>(obj:U, assignments:T):U {
    return (Object as any).assign({}, obj, assignments)
}

function assignDict<T>(d:{[key:string]:T}, key:string, t:T):{[key:string]:T} {
    return (Object as any).assign({}, d, {[key]: t});
}

let Search = (p:{dialect: string, onChange: Function, setDialect: Function}) =>
    <div className="search">
        <input autoFocus placeholder="Search..."  type="text" onChange={p.onChange} />
        <select value={p.dialect} onChange={p.setDialect}>
            <option value="pg">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
            <option value="mssql">MS SQL</option>
            <option value="oracle">Oracle</option>
        </select>
    </div>

let match = (text:string, entry: string) => {
    return entry && entry.toLowerCase().indexOf(text) >= 0;
}

let App = (p:{events: {change: Function, toggle: Function, setDialect: Function}; state: State}) =>
    <div className="app">
        <Search onChange={p.events.change} dialect={p.state.filter.dialect} setDialect={p.events.setDialect} />
        <Categories items={p.state.categories} filter={p.state.filter} onToggle={p.events.toggle}  />
    </div>


let Categories = (p:{items:{[key:string]:Category}, onToggle: Function, filter:Filter}) =>
    <div className="categories">
        {Object.keys(p.items).map(name => <Category data={p.items[name]} onToggle={p.onToggle} filter={p.filter} />)}
    </div>

let Category = (p:{data: Category, onToggle: Function, filter:Filter}) => {

    let shownItems = p.data.entries.filter(entry => match(p.filter.text, entry[p.filter.dialect]))

    let showCategoryName = shownItems.length > 0;
    let showCategory = p.data.shown || (p.filter.text.length > 0 && shownItems.length > 0)

    if (!showCategoryName) return null;

    return <div className="category">
        <label for={p.data.name} class="name">
            <input type="checkbox" id={p.data.name} checked={p.data.shown}
                onChange={e => p.onToggle(p.data.name)} />
            <span />
            <span className="name">{p.data.name}</span>
        </label>
        {showCategory ?
            <div className="entries">
                {shownItems.map(item => <Entry sql={item[p.filter.dialect]} js={item.query} />)}
            </div>
            : null}
     </div>
}

let Entry = (p:{sql: string; js:string}) =>
    <div className="entry">
        <Highlight className="sql">{p.sql}</Highlight>
        <Highlight className="js">{p.js}</Highlight>
    </div>;


let events = {
    change: funcSubject<any>(),
    setDialect: funcSubject<any>(),
    toggle: funcSubject<string>()
}

let toggles = events.toggle.events.map((name:string) =>
        (s:State) => assign(s, {
            categories: assignDict(s.categories, name, assign(s.categories[name], {
                shown: !s.categories[name].shown
            }))
        }))

let urlHash = window.location.hash.replace(/^#/, '').split('&').reduce((acc, el) => {
    let [key, val] = el.split('=').map(decodeURIComponent)
    acc[key] = val;
    return acc;
}, {} as {[key:string]:string})

let dialects = Rx.Observable.return(urlHash['dialect'] || 'pg')
    .merge(events.setDialect.events.map(e => e.target.value))

let dialectMutator = dialects.map(dialect =>
        (s:State) => assign(s, {filter: assign(s.filter, {dialect})}))


let filters = Rx.Observable.return(urlHash['query'] || '')
    .merge(events.change.events.map(e => e.target.value).debounce(500))

let filterMutators = filters.map(text => (s:State) => assign(s, {filter: assign(s.filter, {text})}))

let stateMutators = toggles.merge(dialectMutator).merge(filterMutators)

let hashChanges = Rx.Observable.combineLatest(dialects, filters, (d, f) =>
    d == 'pg' && f == '' ? '' : '#' +
    'dialect=' + encodeURIComponent(d) + '&query=' + encodeURIComponent(f))

hashChanges.subscribe(hash => { if (hash || window.location.hash) window.location.hash = hash })

function mkCategories(data: any) {
    var cats:{[key:string]:Category} = {};
    Object.keys(data).forEach(key => {
        cats[key] = {shown: false, name: key, entries: data[key]};
    });
    return cats;
}

let dataArrival = Rx.DOM.getJSON('/data.json')
    .map(mkCategories)
    .map(cats => (s:State) => assign(s, {categories: cats}));


let state = dataArrival.merge(stateMutators).scan((acc, mutator) => mutator(acc), {
    categories: {} as {[key:string]:Category},
    filter: {
        text: '',
        dialect: 'pg'
    }
})

state.subscribe((state:State) =>
    ReactDOM.render(<App events={events} state={state} />, document.getElementById('container')))