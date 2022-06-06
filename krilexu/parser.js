const { Console } = require('console');
const types = require('./tokens');

class Parse {
    constructor(tokens){
        this.#tokens = tokens;
        this.#cursor = 0;
    }

    #tokens = [];
    #cursor = 0;
    vars = {}

    #at (){
        return this.#tokens[this.#cursor];
    }
    #peak (n=1){
        return this.#tokens[this.#cursor + n];
    }
    #eat (type){
        if(this.#at().type == type){
            this.#cursor++;
        }
        else{
            throw new Error(`Expected ${type} but got ${this.#at().type} at line ${this.#at().line} column ${this.#at().column}`);
        }
    }

    getAst (token){
        let ast;
        let expr;
        let identifier;
        let body;
        switch(token.value){
            case "let":
                this.#cursor++;
                identifier = this.#tokens[this.#cursor];
                this.#cursor++;
                this.#eat(types.EQUALS);

                expr = this.getAst(this.#tokens[this.#cursor]) || this.#parseExpression();
                this.vars[identifier.value] = expr;

                ast = {
                    type: "VariableDeclaration",
                    declarations: [{
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: identifier.value
                        },
                        init: expr
                    }],
                    kind: "let"
                };
                this.#cursor--;
                break;
            case "print":
                this.#cursor++;
                if(this.#at().type == types.GREATER_EQUAL) this.#eat(types.GREATER_EQUAL);
                this.#eat(types.LPARENT);
                expr = this.getAst(this.#tokens[this.#cursor]) || this.#parseExpression();
                this.#eat(types.RPARENT);
                ast = {
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "print"
                        },
                        arguments: [expr]
                    }
                };
                this.#cursor--;
                break;
            //parse function call
            case "call":
                this.#cursor++;
                identifier = this.#tokens[this.#cursor];
                this.#cursor++;
                let args = [];
                if(this.#at().type == types.LPARENT){
                    this.#eat(types.LPARENT);
                    while(this.#at().type != types.RPARENT){
                        args.push(this.#parseExpression());
                        if(this.#at().type == types.COMMA){
                            this.#cursor++;
                        }
                    }
                    
                    this.#eat(types.RPARENT);
                }
                ast = {
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: identifier.value
                        },
                        arguments: args
                    }
                };
                this.#cursor--;
                break;
            case "func":
                this.#cursor++;
                identifier = this.#tokens[this.#cursor];
                this.#cursor++;
                let params = [];
                if(this.#at().type == types.LPARENT){
                    this.#eat(types.LPARENT);
                    while(this.#at().type != types.RPARENT){
                        params.push(this.#parseExpression());
                        if(this.#at().type == types.COMMA){
                            this.#cursor++;
                        }
                    }
                    
                    this.#eat(types.RPARENT);
                }
                if(this.#at().type == types.LAMDA) this.#eat(types.LAMDA);
                this.#eat(types.LBRACE);
                body = [];
                // get body
                while(this.#at().type != types.RBRACE){
                    body.push(this.getAst(this.#tokens[this.#cursor]));
                    this.#cursor++;
                }
                this.#eat(types.RBRACE);
                ast = {
                    type: "FunctionDeclaration",
                    id: {
                        type: "Identifier",
                        name: identifier.value
                    },
                    params: params,
                    body: {
                        type: "BlockStatement",
                        body: body
                    }
                }
                this.#cursor--;
                break;
            case "return":
                this.#cursor++;
                expr = this.#parseExpression();
                ast = {
                    type: "ReturnStatement",
                    argument: expr
                };
                this.#cursor--;
                break;
            case "if":
                // make if statement an else optional
                this.#cursor++;
                this.#eat(types.LPARENT);
                // PARSE CONDIITION
                let condition = this.#parseExpression();
                //console.log(condition);
                this.#eat(types.RPARENT);
                if(this.#at().type == types.LAMDA) this.#eat(types.LAMDA);
                this.#eat(types.LBRACE);
                body = [];
                while(this.#at().type != types.RBRACE){
                    body.push(this.getAst(this.#tokens[this.#cursor]));
                    this.#cursor++;
                }
                this.#eat(types.RBRACE);

                
                if(this.#at().type == types.ELSE){
                    this.#eat(types.ELSE);
                    this.#eat(types.LBRACE);
                    let elseBody = [];
                    while(this.#at().type != types.RBRACE){
                        elseBody.push(this.getAst(this.#tokens[this.#cursor]));
                        this.#cursor++;
                    }
                    this.#eat(types.RBRACE);
                }

                ast = {
                    type: "IfStatement",
                    test: condition,
                    consequent: {
                        type: "BlockStatement",
                        body: body
                    }
                }
                this.#cursor--;
                break;
            case "loop":
                this.#cursor++; 
                this.#eat(types.LPARENT);
                // PARSE CONDIITION
                let loopTimes = this.#parseExpression();

                if(loopTimes.type != "Literal" && loopTimes.type != "BinaryExpression"){
                    throw new Error(`Expected literal but got ${loopTimes.type} at line ${loopTimes.line} column ${loopTimes.column}`);
                }
                //console.log(condition);
                this.#eat(types.RPARENT);
                if(this.#at().type == types.LAMDA) this.#eat(types.LAMDA);
                this.#eat(types.LBRACE);
                body = [];
                while(this.#at().type != types.RBRACE){
                    body.push(this.getAst(this.#tokens[this.#cursor]));
                    this.#cursor++;
                }
                this.#eat(types.RBRACE);

                ast = {
                    type: "LoopStatement",
                    times: loopTimes,
                    body: {
                        type: "BlockStatement",
                        body: body
                    }
                }
                this.#cursor--;
                break;
        }
        return ast;
    }

    parse (){
        let ast = {body: []};
        const length = this.#tokens.length

        while(this.#cursor < length){
            let token = this.#tokens[this.#cursor];
            if(token.type == types.KEYWORD){
                ast.body.push(this.getAst(token))
            }
            this.#cursor++;
        }

        return ast
    }

    #parseExpression (){
        let left = this.#parseNot();

         while(this.#at().type == types.AND || this.#at().type == types.OR){
            let operator = this.#at();
            this.#eat(operator.type);

            let right = this.#parseExpression();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right
            };
        }

        return left;
    }

    #parseNot (){
        let left = this.#parseCondition();

         while(this.#at().type == types.NOT){
            let operator = this.#at();
            this.#eat(operator.type);

            let right = this.#parseNot();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right
            };
        }

        return left;
    }

    #parseCondition (){
        let left = this.#parseTerm();


        while(this.#at().type == types.EQUALITY || this.#at().type == types.INEQUALITY || this.#at().type == types.LESS_EQUAL || this.#at().type == types.GREATER_EQUAL || this.#at().type == types.LESS || this.#at().type == types.GREATER){
            let operator = this.#at();
            this.#eat(operator.type);

            let right = this.#parseCondition();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right
            };
        }

        return left;
    }
    

    #parseTerm (){
        let left = this.#parseFactor();

        while(this.#at().type == types.PLUS || this.#at().type == types.MINUS){
            let operator = this.#at();
            this.#eat(operator.type);

            let right = this.#parseTerm();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right
            };
        }

        return left;
    }

    //this.#at().type == types.EQUALITY || this.#at().type == types.INEQUALITY || this.#at().type == types.LESS_EQUAL || this.#at().type == types.GREATER_EQUAL || this.#at().type == types.LESS || this.#at().type == types.GREATER || this.#at().type == types.AND || this.#at().type == types.OR || this.#at().type == types.NOT
    // Multiplication and division
    #parseFactor (){
        let left = this.#parseType();
        //console.log(this.#peak(-2).type == types.LPARENT, this.#peak(1).type==types.NUMBER,this.#peak(2)?.type == types.PLUS, this.#peak(3)?.type == types.STRING)

         while(this.#at().type == types.MULTIPLY || this.#at().type == types.DIVIDE || (this.#peak(-2).type == types.LPARENT && this.#peak(1).type==types.NUMBER && this.#peak(2)?.type == types.PLUS && (this.#peak(3)?.type == types.STRING||this.#peak(3)?.type == types.IDENTIFIER))||((this.#peak(-1).type == types.STRING || this.#peak(-1).type == types.IDENTIFIER)&& this.#at().type == types.PLUS)){
            let operator = this.#at();
            this.#eat(operator.type);

            let right = this.#parseFactor();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right
            };
        }

        return left;
    }

    // Higher precedence operators
    #parseType (){
        if(this.#at().type == types.NUMBER){
            let literal =  { type: "Literal", value: this.#at().value };
            this.#eat(types.NUMBER);
            return literal;
        }
        else if(this.#at().type == types.STRING){
            let literal =  { type: "Literal", value: this.#at().value };
            this.#eat(types.STRING);
            return literal;
        }
        else if(this.#at().type == types.IDENTIFIER){
            let identifier = { type: "Identifier", name: this.#at().value };
            this.#eat(types.IDENTIFIER);
            return identifier;
        }
        else if(this.#at().type == types.LPARENT){
            this.#eat(types.LPARENT);
            let expr = this.#parseExpression();
            this.#eat(types.RPARENT);
            console.log(expr);
            return expr;
        }
        
    }
}

module.exports = Parse;