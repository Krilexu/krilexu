const Lexer = require("./krilexu/lexer")
const Parser = require("./krilexu/parser")
const Interpreter = require("./krilexu/interpreter")
const util = require("util")


let lexer = new Lexer();

// get string from index.kx including the newlines 
const fs = require("fs");
let file = process.argv[2];

if(!file){
    throw new Error("No file specified");
}
if(file.endsWith(".kx")){
    file = file.replace(".kx", "");
}
let input = fs.readFileSync("./"+file+".kx", "utf8")

if(!input){
    throw new Error("No file found");
}

//put \n in the string
input = input.replace(/\r\n/g, " \n")

//console.log(util.inspect(input, {showHidden: false, depth: null}))

let tokens = lexer.tokenize(input); 

//console.log(tokens)

let parser = new Parser(tokens);

const ast = parser.parse();

//console.log(util.inspect(ast, {showHidden: false, depth: null}));

let interpreter = new Interpreter(ast);

const eval = interpreter.eval();

