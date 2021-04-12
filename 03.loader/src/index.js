console.log('hello, 使用了/src/index.js文件')

class Person {
    constructor(name){
        this.name = name;
    }
    setName(name){
        this.name = name;
    }
}

console.log(new Person('jack'))