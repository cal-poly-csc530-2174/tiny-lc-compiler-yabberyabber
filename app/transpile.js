var parse = require('s-expression');

function numberP(x) {
    return !isNaN(x);
}

function listP(x) {
    return Array.isArray(x);
}

function atomP(x) {
    return !listP(x);
}

function _transpile(ast) {
    if (numberP(ast)) {
        return parseFloat(ast);
    }
    else if (atomP(ast)) {
        return ast;
    }
    else if (ast[0] == 'lambda' || ast[0] == 'λ') {
        return "(function ({id}) { return ({body}); })"
            .replace("{id}", ast[1][0])
            .replace("{body}", _transpile(ast[2]));
    }
    else if (ast[0] == '+') {
        return "({left} + {right})"
            .replace("{left}", _transpile(ast[1]))
            .replace("{right}", _transpile(ast[2]));
    }
    else if (ast[0] == '*') {
        return "({left} * {right})"
            .replace("{left}", _transpile(ast[1]))
            .replace("{right}", _transpile(ast[2]));
    }
    else if (ast[0] == 'ifleq0') {
        return "(({guard} <= 0) ? {true} : {false})"
            .replace("{guard}", _transpile(ast[1]))
            .replace("{true}", _transpile(ast[2]))
            .replace("{false}", _transpile(ast[3]));
    }
    else if (ast[0] == 'println') {
        return "(printit({val}))"
            .replace("{val}", _transpile(ast[1]));
    }
    else {
        return "(({func})({arg}))"
            .replace("{func}", _transpile(ast[0]))
            .replace("{arg}", _transpile(ast[1]));
    }
}

function transpile(source) {
    ast = parse(source);

    return _transpile(ast);
}

module.exports = transpile;
