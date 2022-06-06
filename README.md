# **KRILEXU**
### **THIS IS ONLY IN ALPHA**

Krilexu is a simple integrated programming language made with nodejs.
# 
## HOW TO USE
If you have GIT installed then just do this command to copy the repo into your folder.
`$ git clone https://github.com/Krilexu/krilexu.git`
Or alternatively you can just download the zip file in the code section and then add it to your editor of choice. 

### QUICK START 
You need to have nodejs installed in order for the language to work. You can download it here -> [https://nodejs.org/en/download/](url)

when you have opened the repo run the command `node . index`. This command will run the main.js file which in turn runs the index.kx file which you can edit. If you want to edit another file type the same command but change the index to the same name as the file.

_DISCLAIMER: THE FILE EXTENSIONS FOR THE LANGUAGE END WITH .KX_

When you've run the command you should be greeted with a "Hello World!"

You can now feel free to change and edit the .kx file.

### EXAMPLES
You get the file index.kx as an example file to use. 
The file already has the HELLO WORLD example

**HELLO WORLD EXAMPLE**:
```
// Declare function with "func" keyword, arguments, parenthesis and arrows are optional
func main(x) => {
    print("Hello World!");
}


// Call function with "call" keyword, arguments and parenthesis are optional
call main()
```
**MATH EXAMPLE:**
```
func add(a,b) => {
    return a + b;
}

func sub(a,b){
    return a - b;
}

// both work ^^

let res = call add(1,2) + call sub(4,3); // call returns what the function returns, you can use it in a expression

print(res) // prints 5
```
**IF AND LOOP STATEMENTS EXAMPLES:**
```
func loopExample { // you don't need parenthesis 
    let i = 0;
    loop(5) => { // both with or without the arrow works
        let i = i + 1;
        print("Hello, world! " + i)
    }
}

call loopExample // you don't need parenthesis either here. Print "Hello, world! " + i 5 times

func ifExample(i) {
    if(i == 0) {
        print("i is 0")
    } 
    elseif(i == 1) => {            // with or without the arrow works
        print("i is 1")
    }
    elseif(i == 2) {
        print("i is 2")
    }
    elseif(i>=3){
        print("i is greater or equals 3")
    }
    else {
        print("i is neither 0,1,2 nor greater or equals 3")
    }
}

call ifExample(-1) // prints "i is neither 0,1,2 nor greater or equals 3"
call ifExample(2) // prints "i is 2"
call ifExample(69) // prints "i is greater or equals 3"

```

### **BEWARE THIS LANGUAGE STILL HAS MANY BUGS SO REPORT THEM IF YOU FIND ANY, THANK YOU!**