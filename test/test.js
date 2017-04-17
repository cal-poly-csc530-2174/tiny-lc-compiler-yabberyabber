var assert = require('assert');
var transpile = require('../app/transpile.js');

function assert_compiles(source, dest) {
    assert.strictEqual(transpile(source), dest);
}

function assert_evals(source, val) {
    assert.equal(eval(transpile(source)), val);
}

describe('Transpiler', function() {
	it('Numeric case', function() {
        assert_compiles('5', 5);
        assert_compiles('5.5', 5.5);
        assert_compiles('-5.5', -5.5);
    });

    it('Identifiers', function() {
        assert_compiles('panda', 'panda');
    });

    it('Func def', function() {
        assert_compiles("(lambda (x) 5)", "function (x) { return (5); }");
        assert_compiles("(λ (x) 5)", "function (x) { return (5); }");
    });

    it('Arithmetic', function() {
        assert_compiles("(+ 5 4)", "(5 + 4)");
        assert_compiles("(* 5 4)", "(5 * 4)");
        assert_compiles("(* oops 4)", "(oops * 4)");
    });

    it('Application', function() {
        assert_compiles('(panda 5)', '(panda)(5)');
        assert_compiles('((lambda (x) 7) 5)',
            '(function (x) { return (7); })(5)');
    });

    it('If x<=0', function() {
        assert_compiles('(ifleq0 1 yas nar)',
            '((1 <= 0) ? yas : nar)');
    });

    it('Nesting', function() {
        assert_compiles('((lambda (x) (+ x 7)) 5)',
            '(function (x) { return ((x + 7)); })(5)');
    });
});

describe('Evaluation', function() {
	it('Numeric case', function() {
        assert_evals('5', 5);
        assert_evals('5.5', 5.5);
        assert_evals('-5.5', -5.5);
    });

    it('Arithmetic', function() {
        assert_evals("(+ 5 4)", 9);
        assert_evals("(* 5 4)", 20);
    });

    it('Application', function() {
        assert_evals('((lambda (x) 7) 5)', 7);
    });

    it('If x<=0', function() {
        assert_evals('(ifleq0 1 8 7)', 7);
    });

    it('Nesting', function() {
        assert_evals('((lambda (x) (+ x 7)) 5)', 12);
    });
});
