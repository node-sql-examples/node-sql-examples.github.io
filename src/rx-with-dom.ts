import * as Rx from 'rx'
import * as Rxx from 'rx-dom-ajax'

Rx.DOM = (Rxx as any).Rx.DOM;

export = Rx;