import * as React from 'react'
import * as T from './types'

declare var require:any;
let Highlight = require('react-highlight')

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

export let App = ({events: {change, toggle, setDialect}, state}: {events:any, state: T.State}) =>
    <div className="app">
        <Search onChange={change} dialect={state.filter.dialect} setDialect={setDialect} />
        <Categories items={state.categories} filter={state.filter} onToggle={toggle}  />
    </div>

let Category = ({data, onToggle, filter}:{data: T.Category, onToggle: Function, filter:T.Filter}) => {

    let shownItems = data.entries.filter(entry => match(filter.text, entry[filter.dialect]))

    let showCategoryName = shownItems.length > 0;
    let showCategory = data.shown || (filter.text.length > 0 && shownItems.length > 0)

    if (!showCategoryName) return null;

    return <div className="category">
        <label for={data.name} class="name">
            <input type="checkbox" id={data.name} checked={data.shown}
                onChange={e => onToggle(data.name)} />
            <span />
            <span className="name">{data.name}</span>
        </label>
        {showCategory ?
            <div className="entries">
                {shownItems.map(item => <Entry sql={item[filter.dialect]} js={item.query} />)}
            </div>
            : null}
     </div>
}

let Categories = ({items, onToggle, filter}:{items:{[key:string]: T.Category}, onToggle: Function, filter: T.Filter}) =>
    <div className="categories">
        {Object.keys(items).map(name => <Category data={items[name]} onToggle={onToggle} filter={filter} />)}
    </div>


let Entry = ({sql, js}:{sql: string; js:string}) =>
    <div className="entry">
        <Highlight className="sql">{sql}</Highlight>
        <Highlight className="js">{js}</Highlight>
    </div>;

