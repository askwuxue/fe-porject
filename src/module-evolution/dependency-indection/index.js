// 模块fnA
let fnA = function(){
  return {name: '我是fnA'}
}

// 模块fnB
let fnB = function(){
  return {name: '我是fnB'}
}

// 模块fnD
let fnD = function(){
  return {name: '我是fnD'}
}

// 依赖注入的发展原因和流程
// 第一步
// 存在的问题：不知道FnC内部的依赖是什么，不能对FnC内部依赖FnA,FnB修改，因为可能会导致FnA和FnB的调用出错
// let fnC = function(){
//   let a = fnA()
//   let b = fnB()
//   console.log(a, b)
// }

// 第二步
// 将依赖作为参数传入模块，但是导致FnC的调用僵硬，不够灵活
let fnC = function(fnA, fnB){
  let a = fnA()
  let b = fnB()
  console.log(a, b)
}

// 需要依赖注入
// 1. 可以实现依赖的注册
// 2. 依赖注入器应该可以接收依赖（函数等），注入成功后给我们返回一个可以获取所有资源的函数
// 3. 依赖注入器要能够保持传递函数的作用域
// 4. 传递的函数能够接收自定义的参数，而不仅仅是被描述的依赖项

const injector = {
  dependencies: {},
  register: function(key, value) {
    this.dependencies[key] = value;
  },
  resolve: function(deps, func, scope) {
    const args = [];
    for(let i = 0; i < deps.length, d = deps[i]; i++) {
      if(this.dependencies[d]) {
        // 存在此依赖
        args.push(this.dependencies[d]);
      } else {
        // 不存在
        throw new Error('不存在依赖：' + d);
      }
    }
    return function() {
      console.log('Array.prototype.slice.call(arguments: ', Array.prototype.slice.call(arguments));
      func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }   
  }
}

// 添加
injector.register('fnA', fnA)
injector.register('fnB', fnB)

// 注入
injector.resolve(['fnA', 'fnB'], function(fnA, fnB){
  let a = fnA()
  let b = fnB()
  console.log(a, b)
})(fnD)
