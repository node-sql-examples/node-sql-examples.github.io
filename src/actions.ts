import funcSubject from './func-subject'
import {State, Category} from './types'
import {assign, assignDict} from './util'
import {Observable, DOM} from './rx-with-dom'

export let events = {
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

let dialects = Observable.return(urlHash['dialect'] || 'pg')
    .merge(events.setDialect.events.map(e => e.target.value))

let filters = Observable.return(urlHash['query'] || '')
    .merge(events.change.events.map(e => e.target.value).debounce(500))

let mkCategories = (data: any) => {
    var cats:{[key:string]:Category} = {};
    Object.keys(data).forEach(key => {
        cats[key] = {shown: false, name: key, entries: data[key]};
    });
    return cats;
}

let dataReceived = DOM.getJSON('/data.json').map(mkCategories)

export let actions = {dialects, filters, dataReceived, toggles}