const cardProcessor = require('./CardProcessor')

var args = process.argv.slice(2)

console.log(args[1])
cardProcessor.process(args[0], args[1])
