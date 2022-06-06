const tokenTypes = require('./tokens');

class Lexer {
    constructor(){}

    #stream = "";
    #cursor = 0;
    #line = 1;
    #column = 0

    #at (){
        return this.#stream[this.#cursor];
    }

    #peak (n=1){
        return this.#stream[this.#cursor + n];
    }

    tokenize(input=""){
        this.#stream = input;
        this.#cursor = 0;
        this.#line = 1;
        this.#column = 0;

        let tokens = [];

        let keywords = ["print", "let", "if", "else", "elseif", "true", "false", "func", "call", "return", "loop", "break", "continue"];
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890'

        // loop stream
        while(this.#cursor < this.#stream.length){
            let columnFix = 0;
            let value = "";
            switch(this.#at()){
                case " ":
                case "\t":
                    break;
                case "\r":
                case "\n":
                    this.#line++;
                    this.#column = 0;
                    break
                case "/":
                    if(this.#peak() == "/"){
                        while(this.#at() != "\n"){
                            this.#cursor++;
                        }
                        this.#line++;
                        this.#column = 0;
                        break;
                    }

                case "=":
                    // check if next char is =
                    if(this.#stream[this.#cursor + 1] == "="){
                        tokens.push({
                            type: tokenTypes.EQUALITY,
                            value: "==",
                            line: this.#line,
                            column: this.#column
                        });
                        this.#cursor++;
                        this.#column++;
                        break
                    }
                    else if(this.#stream[this.#cursor + 1] == ">"){
                        tokens.push({
                            type: tokenTypes.LAMDA,
                            value: "=>",
                            line: this.#line,
                            column: this.#column
                        });
                        this.#cursor++;
                        this.#column++;
                        break
                    }
                    tokens.push({type: tokenTypes.EQUALS, value: "=", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "n":
                    if(this.#stream[this.#cursor + 1] == "o"){
                        if(this.#stream[this.#cursor + 2] == "t"){
                            tokens.push({
                                type: tokenTypes.NOT,
                                value: "not",
                                line: this.#line,
                                column: this.#column
                            });
                            this.#cursor += 2;
                            this.#column += 2;
                            break
                        }
                    }
                    value = "";
                    columnFix = -2;

                    while(chars.includes(this.#at()) && this.#cursor < this.#stream.length){
                        value += this.#at();
                        this.#cursor++;
                        columnFix++
                    }

                    this.#cursor--;

                    if(keywords.includes(value)){
                        tokens.push({type: tokenTypes.KEYWORD, value: value, line: this.#line, column: this.#column});
                    }
                    else{
                        tokens.push({type: tokenTypes.IDENTIFIER, value: value, line: this.#line, column: this.#column});
                    }
                    this.#column += columnFix;
                    break;
                case "o":
                    if(this.#stream[this.#cursor + 1] == "r"){
                        tokens.push({
                            type: tokenTypes.OR,
                            value: "or",
                            line: this.#line,
                            column: this.#column
                        });
                        this.#cursor++;
                        this.#column++;
                        break
                    }
                    value = "";
                    columnFix = -2;

                    while(chars.includes(this.#at()) && this.#cursor < this.#stream.length){
                        value += this.#at();
                        this.#cursor++;
                        columnFix++
                    }

                    this.#cursor--;

                    if(keywords.includes(value)){
                        tokens.push({type: tokenTypes.KEYWORD, value: value, line: this.#line, column: this.#column});
                    }
                    else{
                        tokens.push({type: tokenTypes.IDENTIFIER, value: value, line: this.#line, column: this.#column});
                    }
                    this.#column += columnFix;
                    break;
                case "a":
                    if(this.#stream[this.#cursor + 1] == "n"){
                        if(this.#stream[this.#cursor + 2] == "d"){
                            tokens.push({
                                type: tokenTypes.AND,
                                value: "and",
                                line: this.#line,
                                column: this.#column
                            });
                            this.#cursor += 2;
                            this.#column += 2;
                            break
                        }
                    }
                    
                    value = "";
                    columnFix = -2;

                    while(chars.includes(this.#at()) && this.#cursor < this.#stream.length){
                        value += this.#at();
                        this.#cursor++;
                        columnFix++
                    }

                    this.#cursor--;

                    if(keywords.includes(value)){
                        tokens.push({type: tokenTypes.KEYWORD, value: value, line: this.#line, column: this.#column});
                    }
                    else{
                        tokens.push({type: tokenTypes.IDENTIFIER, value: value, line: this.#line, column: this.#column});
                    }
                    this.#column += columnFix;
                    break;
                case "+":
                    tokens.push({type: tokenTypes.PLUS, value: "+", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "-":
                    tokens.push({type: tokenTypes.MINUS, value: "-", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "*":
                    tokens.push({type: tokenTypes.MULTIPLY, value: "*", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "/":
                    tokens.push({type: tokenTypes.DIVIDE, value: "/", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "(":
                    tokens.push({type: tokenTypes.LPARENT, value: "(", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case ")":
                    tokens.push({type: tokenTypes.RPARENT, value: ")", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "{":
                    tokens.push({type: tokenTypes.LBRACE, value: "{", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "}":
                    tokens.push({type: tokenTypes.RBRACE, value: "}", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case ">":
                    if(this.#stream[this.#cursor + 1] == "="){
                        tokens.push({
                            type: tokenTypes.GREATER_EQUAL,
                            value: ">=",
                            line: this.#line,
                            column: this.#column
                        });
                        this.#cursor++;
                        this.#column++;
                        break;
                    }
                    tokens.push({type: tokenTypes.GREATER, value: ">", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case "<":
                    // check if next char is =
                    if(this.#stream[this.#cursor + 1] == "="){
                        tokens.push({
                            type: tokenTypes.LESS_EQUAL,
                            value: "<=",
                            line: this.#line,
                            column: this.#column
                        });
                        this.#cursor++;
                        this.#column++;
                        break;
                    }
                    tokens.push({type: tokenTypes.LESS, value: "<", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case ",":
                    tokens.push({type: tokenTypes.COMMA, value: ",", line: this.#line, column: this.#column});
                    this.#column++;
                    break;
                case '"':
                    let string = "";
                    this.#cursor++;
                    columnFix = -2;

                    while(this.#at() != '"' && this.#cursor < this.#stream.length){
                        string += this.#at();
                        this.#cursor++;
                        columnFix++;
                    }

                    if(this.#at() != '"'){
                        throw new Error(`Expected '"' but got ${this.#at()} at line ${this.#line} column ${this.#column}`);
                    }

                    this.#column--;
                    tokens.push({type: tokenTypes.STRING, value: string, line: this.#line, column: this.#column});
                    this.#column += columnFix+1;
                    break;
                default:
                    if(isNumber(this.#at())){
                        let value = "";
                        let floatingPoint = false;

                        while((isNumber(this.#at()) || (this.#at() == "." && !floatingPoint)) && this.#cursor < this.#stream.length){
                            if(this.#at() == ".") floatingPoint = true;
                            value += this.#at();
                            this.#cursor++;
                        }

                        this.#cursor--;
                        this.#column--;
                        tokens.push({type: tokenTypes.NUMBER, value: parseFloat(value, 10), line: this.#line, column: this.#column});
                    }
                    else if(chars.includes(this.#at())){
                        value = "";
                        columnFix = -2;

                        while(chars.includes(this.#at()) && this.#cursor < this.#stream.length){
                            value += this.#at();
                            this.#cursor++;
                            columnFix++
                        }

                        this.#cursor--;

                        if(keywords.includes(value)){
                            tokens.push({type: tokenTypes.KEYWORD, value: value, line: this.#line, column: this.#column});
                        }
                        else{
                            tokens.push({type: tokenTypes.IDENTIFIER, value: value, line: this.#line, column: this.#column});
                        }
                        this.#column += columnFix;
                    }

                    this.#column++;
                    break;
            }

            if(this.#at() !== "\n")this.#column++;
            this.#cursor++;
        }

        let endLine = 1;
        let endColumn = 0;
        for (let i = 0; i < this.#stream.length; i++) {
            if(this.#stream[i] == "\n"){
                endLine++;
                endColumn = 0;
            }
            else{
                endColumn++;
            }
        }

        tokens.push({type: tokenTypes.EOF, value: "EOF", line: endLine, column: endColumn});
        return tokens;
    }
}

function isNumber(char=""){
    if(char == " " || char == ".") return false;
    return !isNaN(char);
}

module.exports = Lexer;