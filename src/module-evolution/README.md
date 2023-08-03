
### CommonJS
CommonJS 规范中规定每个文件就是一个独立的模块，有自己的作用域，模块的变量、函数、类都是私有的，外部想要调用，必须使用 module.exports 主动暴露，而在另一个文件中引用则直接使用 require(path) 即可