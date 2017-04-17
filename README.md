# Lambda Calculus to JavaScript transpiler

This project has two interfaces.  

## Node interface

The version that professor Clements wants to use is the node interface.  To use this interface, clone the repository and run `node main.js`.  The program will then read in whatever source is passed via stdin.  When the program hits EOF in stdin it will output the corresponding javascript source and will begin evalling the program.

## Browser interface

The version that is cool and hit is in the browser at https://yabberyabber.github.io/lambda-calc-js-transpiler/.  This version is roughly the same except instead of using the λ character, the user must write out "lambda" (because webpack has awkward unicode support).  Be forwarned, the browser severely limits the call stack size of any program.  
