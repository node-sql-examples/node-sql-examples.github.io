import {state, hashChanges} from './store'
import {App} from './App'
import * as ReactDOM from 'react-dom'
import {events} from './actions'
import * as React from 'react'

state.subscribe(state =>
    ReactDOM.render(<App events={events} state={state} />,
                    document.getElementById('container')))

hashChanges.subscribe(hash => {
    if (hash || window.location.hash) {
        window.location.hash = hash
    }
})
