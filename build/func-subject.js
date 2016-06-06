"use strict";
var Rx = require('./rx-with-dom');
function subject() {
    var obs = new Rx.Subject();
    var emit = function emit(t) {
        obs.onNext(t);
    };
    emit.events = obs;
    return emit;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = subject;
//# sourceMappingURL=func-subject.js.map