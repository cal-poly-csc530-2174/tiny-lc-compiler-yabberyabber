/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var not_whitespace_or_end = /^(\S|$)/;
var space_quote_paren_escaped_or_end = /^(\s|\\|"|'|`|,|\(|\)|$)/;
var string_or_escaped_or_end = /^(\\|"|$)/;
var quotes = /('|`|,)/;
var quotes_map = {
    '\'': 'quote',
    '`':  'quasiquote',
    ',':  'unquote'
};

function SParser(stream) {
    this._line = this._col = this._pos = 0;
    this._stream = stream;
}

SParser.prototype = {
    peek: peek,
    consume: consume,
    until: until,
    error: error,
    string: string,
    atom: atom,
    quoted: quoted,
    expr: expr,
    list: list
};

module.exports = function SParse(stream) {
    var parser = new SParser(stream);
    var expression = parser.expr();

    if (expression instanceof Error) {
        return expression;
    }

    // if anything is left to parse, it's a syntax error
    if (parser.peek() != '') {
        return parser.error('Superfluous characters after expression: `' + parser.peek() + '`');
    }

    return expression;
};

module.exports.SyntaxError = Error;

function error(msg) {
    var e = new Error('Syntax error: ' + msg);
    e.line = this._line + 1;
    e.col  = this._col + 1;
    return e;
}

function peek() {
    if (this._stream.length == this._pos) return '';
    return this._stream[this._pos];
}

function consume() {
    if (this._stream.length == this._pos) return '';

    var c = this._stream[this._pos];
    this._pos += 1;

    if (c == '\r') {
        if (this.peek() == '\n') {
            this._pos += 1;
            c += '\n';
        }
        this._line++;
        this._col = 0;
    } else if (c == '\n') {
        this._line++;
        this._col = 0;
    } else {
        this._col++;
    }

    return c;
}

function until(regex) {
    var s = '';

    while (!regex.test(this.peek())) {
        s += this.consume();
    }

    return s;
}

function string() {
    // consume "
    this.consume();

    var str = '';

    while (true) {
        str += this.until(string_or_escaped_or_end);
        var next = this.peek();

        if (next == '') {
            return this.error('Unterminated string literal');
        }

        if (next == '"') {
            this.consume();
            break;
        }

        if (next == '\\') {
            this.consume();
            next = this.peek();

            if (next == 'r') {
                this.consume();
                str += '\r';
            } else if (next == 't') {
                this.consume();
                str += '\t';
            } else if (next == 'n') {
                this.consume();
                str += '\n';
            } else if (next == 'f') {
                this.consume();
                str += '\f';
            } else if (next == 'b') {
                this.consume();
                str += '\b';
            } else {
                str += this.consume();
            }
        }
    }

    // wrap in object to make strings distinct from symbols
    return new String(str);
}

function atom() {
    if (this.peek() == '"') {
        return this.string();
    }

    var atom = '';

    while (true) {
        atom += this.until(space_quote_paren_escaped_or_end);
        var next = this.peek();

        if (next == '\\') {
            this.consume();
            atom += this.consume();
            continue;
        }

        break;
    }

    return atom;
}

function quoted() {
    var q = this.consume();
    var quote = quotes_map[q];

    if (quote == "unquote" && this.peek() == "@") {
        this.consume();
        quote = "unquote-splicing";
        q = ',@';
    }

    // ignore whitespace
    this.until(not_whitespace_or_end);
    var quotedExpr = this.expr();

    if (quotedExpr instanceof Error) {
        return quotedExpr;
    }

    // nothing came after '
    if (quotedExpr === '') {
        return this.error('Unexpected `' + this.peek() + '` after `' + q + '`');
    }

    return [quote, quotedExpr];
}

function expr() {
    // ignore whitespace
    this.until(not_whitespace_or_end);

    if (quotes.test(this.peek())) {
        return this.quoted();
    }

    var expr = this.peek() == '(' ? this.list() : this.atom();

    // ignore whitespace
    this.until(not_whitespace_or_end);

    return expr;
}

function list() {
    if (this.peek() != '(') {
        return this.error('Expected `(` - saw `' + this.peek() + '` instead.');
    }

    this.consume();

    var ls = [];
    var v = this.expr();

    if (v instanceof Error) {
        return v;
    }

    if (v !== '') {
        ls.push(v);

        while ((v = this.expr()) !== '') {
            if (v instanceof Error) return v;
            ls.push(v);
        }
    }

    if (this.peek() != ')') {
        return this.error('Expected `)` - saw: `' + this.peek() + '`');
    }

    // consume that closing paren
    this.consume();

    return ls;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_s_expression__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_s_expression___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_s_expression__);


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
    else if (ast[0] == 'lambda') {
        return "function ({id}) { return ({body}); }"
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
        return "console.log({val});"
            .replace("{val}", _transpile(ast[1]));
    }
    else {
        return "({func})({arg})"
            .replace("{func}", _transpile(ast[0]))
            .replace("{arg}", _transpile(ast[1]));
    }
}

function transpile(source) {
    var ast = __WEBPACK_IMPORTED_MODULE_0_s_expression__(source);

    return _transpile(ast);
}

function component() {
    var element = document.createElement("div");

    element.innerHTML = transpile('5');

    return element;
}

function evaluate() {
    var source = document.getElementById('src').value;
    var compiled = document.getElementById('transpiled');
    var evaled = document.getElementById('evaluated');

    try {
        compiled.innerHTML = transpile(source);
        try {
            evaled.innerHTML = eval(transpile(source));
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


/***/ })
/******/ ]);