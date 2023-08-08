// requireJS.js 实现
(function () {
  // 缓存
  const cache = {}
  let moudle = null
  const tasks = []
  
  // 创建script标签，用来加载文件模块
  const createNode = function (depend) {
    let script = document.createElement("script");
    script.src = `./${depend}.js`;
    // 嵌入自定义 data-moduleName 属性，后可由dataset获取
    script.setAttribute("data-moduleName", depend);
    let fs = document.getElementsByTagName('script')[0];
    fs.parentNode.insertBefore(script, fs);
    return script;
  }

  // 校验所有依赖是否都已经解析完成
  const hasAlldependencies = function (dependencies) {
    let hasValue = true
    dependencies.forEach(depd => {
      if (!cache.hasOwnProperty(depd)) {
        hasValue = false
      }
    })
    return hasValue
  }

  // 递归执行callback
  const implementCallback = function (callbacks) {
    if (callbacks.length) {
      callbacks.forEach((callback, index) => {
        // 所有依赖解析都已完成
        if (hasAlldependencies(callback.dependencies)) {
          const returnValue = callback.callback(...callback.dependencies.map(it => cache[it]))
          if (callback.name) {
            cache[callback.name] = returnValue
          }
          tasks.splice(index, 1)
          implementCallback(tasks)
        }
      })
    }
  }
   
  // 根据依赖项加载js文件
  const require = function (dependencies, callback) {
    console.log('dependencies: ', dependencies);
    // 此文件没有依赖项
    if (!dependencies.length) {
      moudle = {
        value: callback()  
      }
      //此文件有依赖项
    } else {
      moudle = {
        dependencies,
        callback
      }
      tasks.push(moudle)
      // 遍历依赖项，加载js文件
      dependencies.forEach(function (item) {
        if (!cache[item]) {
          // 创建script并加载对应的模块
          createNode(item).onload = function () {
            // 获取嵌入属性值，即module名
            let modulename = this.dataset.modulename
            console.log('moudle: ', moudle);
            // 校验module中是否存在value属性
            if (moudle.hasOwnProperty('value')) {
              // 存在，将其module value（模块返回值｜导出值）存入缓存
              cache[modulename] = moudle.value
            } else {
              // 不存在
              moudle.name = modulename
              if (hasAlldependencies(moudle.dependencies)) {
                // 所有依赖解析都已完成，执行回调，抛出依赖返回（导出）值
                cache[modulename] = callback(...moudle.dependencies.map(v => cache[v]))
              }
            }
            // 递归执行callback
            implementCallback(tasks)
          }
        }
      })
    }
  }

  window.require = require
  window.define = require
})(window)
