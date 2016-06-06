import {Category, State} from './types'
import {assign} from './util'
import {actions} from './actions'
import {Observable} from './rx-with-dom'

let {dialects, filters, toggles, dataReceived} = actions;

let dialectMutator = dialects
    .map(dialect => (s:State) => assign(s, {filter: assign(s.filter, {dialect})}))

let filterMutators = filters
    .map(text => (s:State) => assign(s, {filter: assign(s.filter, {text})}))

let categoryMutator = dataReceived
    .map(cats => (s:State) => assign(s, {categories: cats}));

let stateMutators = toggles.merge(dialectMutator).merge(filterMutators).merge(categoryMutator)

let initialState = {
    categories: {} as {[key:string]:Category},
    filter: {
        text: '',
        dialect: 'pg'
    }
}

export let state = stateMutators
    .scan((acc, mutator) => mutator(acc), initialState)

let mkHash = (d: string, f: string) =>
    '#dialect=' + encodeURIComponent(d) + '&query=' + encodeURIComponent(f)

export let hashChanges = Observable.combineLatest(dialects, filters, (d, f) =>
    d == 'pg' && f == '' ? '' : mkHash(d, f))
