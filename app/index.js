var transpile = require('./transpile.js');

function component() {
    var element = document.createElement("div");

    element.innerHTML = transpile('5');

    return element;
}

function evaluate() {
    var source = document.getElementById('src').value;
    var compiled = document.getElementById('transpiled');
    var evaled = document.getElementById('evaluated');
    var output = document.getElementById('output');

    try {
        var stdout = "";
        var printit = function(v) {
            stdout += "" + v + "\n";
        };

        compiled.innerHTML = transpile(source);
        try {
            evaled.innerHTML = eval(transpile(source));
            output.innerHTML = stdout;
        }
        catch (e) {
            evaled.innerHTML = "runtime error\n" + e;
            console.log(e);
        }
    }
    catch (e) {
        compiled.innerHTML = "compile error\n" + e;
        evaled.innerHTML = "compile error";
        console.log(e);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    console.log('window - DOMContentLoaded - capture');
    evaluate();
    document.getElementById('go').addEventListener("click", evaluate);
}, true);
