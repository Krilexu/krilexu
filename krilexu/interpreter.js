class Interpreter {
    constructor(ast) {
        this.#ast = ast;
    }

    #ast = {};
    #vars = {print: (...args) => console.log(...args)};


    eval(body=this.#ast.body) {

        let length = body.length;
        
        // check every node in the ast
        for (let i = 0; i < length; i++) {
            let node = body[i];
            this.#interpret(node)
            
        }
    }

    #interpret(node){
        let identifier
        let condition
        if(node == undefined)return undefined;
        switch (node.type) {
            case "BinaryExpression":
                return this.#evalExpression(node);
            case "Identifier":
                if(this.#vars[node.name] == undefined){
                    throw new Error(`${node.name} is undefined`)
                }
                return this.#vars[node.name];
            case "Literal":
                return node.value;
            case "VariableDeclaration":
                identifier = node.declarations[0].id.name;
                let expr = this.#interpret(node.declarations[0].init);
                this.#vars[identifier] = expr;
                break;
            case "ExpressionStatement":
                return this.#interpret(node.expression);
            case "CallExpression":
                let func = this.#vars[node.callee.name];
                // check if the function is a array
                if(Array.isArray(func)){
                    let args = Object.keys(this.#vars).filter(key => this.#vars[key] === "null" || this.#vars[key] === undefined)
                    for(let i = 0; i < args.length; i++){
                        if(this.#interpret(node.arguments[i]) !== undefined)this.#vars[args[i]] = this.#interpret(node.arguments[i]);
                    }
                    for(let i = 0; i < func.length; i++){
                        let res = this.#interpret(func[i]);
                        if(func[i].expression?.callee?.name != "print"){
                            for(let i = 0; i < args.length; i++){
                                this.#vars[args[i]] = undefined
                            }
                        }
                        if(res != undefined)return res;
                    }
                
                    return "null"
                }
                // make args run block statement
                let args = node.arguments.map(arg => this.#interpret(arg));

                if(typeof func != "function"){
                    throw new Error("Function not found");
                }
                return func(...args);
            case "FunctionDeclaration":
                identifier = node.id.name;
                let length = node.params.length;
                    for (let i = 0; i < length; i++) {
                        let param = node.params[i]
                        this.#vars[param.name] = "null";
                    }
                this.#vars[identifier] = node.body.body
                
                break;        
            case "ReturnStatement":
                return this.#interpret(node.argument);
            case "BlockStatement":
                for(let i = 0; i < node.body.length; i++){
                    if(node.body[i].type == "ReturnStatement"){
                        return this.#interpret(node.body[i]);
                    }
                    this.#interpret(node.body[i]);
                }
            case "IfStatement":
                //  het elseif in order
                condition = this.#interpret(node.test);
                if(condition){
                    return this.#interpret(node.consequent);
                }
                else if(node.alternate != undefined){
                    return this.#interpret(node.alternate);
                }
                break;
            case "LoopStatement":
                let times = this.#interpret(node.times);
                if(!times){
                    throw new Error("Loop amount is undefined");
                }
                for(let i = 0; i < times; i++){
                    this.#interpret(node.body);
                }
                break;
        }
    }

    #evalExpression(exp) {
        let left = this.#interpret(exp.left);
        let right = this.#interpret(exp.right);

        switch (exp.operator) {
            case "+":
                if(typeof right == "boolean"){
                    return right
                }
                else if(typeof left == "boolean"){
                    return left
                }

                
                return left + right;
            case "-":
                if(typeof right == "boolean"){
                    return right
                }
                else if(typeof left == "boolean"){
                    return left
                }
                return left - right;
            case "*":
                if(typeof right == "boolean"){
                    return right
                }
                else if(typeof left == "boolean"){
                    return left
                }
                return left * right;
            case "/":
                if(typeof right == "boolean"){
                    return right
                }
                else if(typeof left == "boolean"){
                    return left
                }
                return left / right;
            case ">":
                return left > right;
            case "<":
                return left < right;
            case ">=":
                return left >= right;
            case "<=":
                return left <= right;
            case "==":
                return left == right;
            case "!=":
                return left != right;
            case "not":
                if(right == undefined){
                    throw new Error("Expected conditional expression or boolean value");
                }
                return !right;
            case "and":
                if(left == undefined || right == undefined){
                    throw new Error("Expected conditional expression or boolean value");
                }
                return left && right;
            case "or":
                if(left == undefined || right == undefined){
                    throw new Error("Expected conditional expression or boolean value");
                }
                return left || right;
        }
    }
}

module.exports = Interpreter;