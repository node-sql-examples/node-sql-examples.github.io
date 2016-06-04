var walk = require('./walk')
var match = require('./match')
var path = require('path')
var acorn = require('acorn')
var fs = require('fs')
var L = require('lodash')
var testExpression = require('./test-expression')

var dir = path.resolve(require.resolve('sql'), '../../test/dialects')

var files = fs.readdirSync(dir)
    .filter(f => /\.js$/.test(f))
    .map(file => ({name: file, data: fs.readFileSync(path.resolve(dir, file), 'utf8')}));

var examples = L.flatMap(files, f => getExamples(f))

console.log(JSON.stringify(L.groupBy(examples, e => e.category)))

function getExamples(file) {
    var source = file.data;
    var category = file.name.replace('-tests.js', '')
    var ast = acorn.parse(source);
    var examples = [];

    walk(ast, node => {
        if (match(testExpression, node)) {
            var props = node.arguments[0].properties;
            var data = {}
            try {
            props.forEach(prop => {
                if (prop.key.name == 'query') {
                    data['query'] = source.substring(prop.value.start, prop.value.end);
                }
                else if (prop.key.name !== 'params' && prop.key.name !== 'values') {
                    var throws = prop.value.properties.filter(p => p.key.name === 'throws')[0];
                    if (throws) return;
                    var queryText = prop.value.properties.filter(p => p.key.name === 'text')[0];
                    if (queryText) data[prop.key.name] = queryText.value.value
                }
            })
            } catch (e) {
                console.log("Could not parse ", source.substring(node.start, node.end))
                console.error(e.stack);
                process.exit(1)
            }
            data.category = category;
            examples.push(data)
        }
    })
    return examples;
}
