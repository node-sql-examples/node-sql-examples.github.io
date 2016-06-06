"use strict";
function assign(obj, assignments) {
    return Object.assign({}, obj, assignments);
}
exports.assign = assign;
function assignDict(d, key, t) {
    return Object.assign({}, d, (_a = {}, _a[key] = t, _a));
    var _a;
}
exports.assignDict = assignDict;
//# sourceMappingURL=util.js.map