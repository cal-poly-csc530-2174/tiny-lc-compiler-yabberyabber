const transpile = require('./app/transpile.js');
const readline = require('readline');

function printit(x) {
    console.log(x);
    return 0;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

source = '';
rl.on('line', function(line) {
    source += line + '\n';
});

rl.on('close', function() {
    console.log(transpile(source));
    eval(transpile(source));
});
