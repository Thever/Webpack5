// loader本质上是一个函数
// 接受3个参数，内容，map映射信息，meta元信息
// module.exports = function(content, map, meta){
//     console.log('loader1')
//     console.log(content)
//     // 返回处理好的内容
//     return content;
// }

// 同步执行的另一种方式
// module.exports = function(content, map, meta){
//     console.log('loader11')
//     // loader中this.callback回调, 接受4个参数：错误(没有就传null), 处理后暴露的内容content, 映射关系map，元信息meta
//     // 其中map,meta参数可不传，只传入error和content即可
//     this.callback(null, content, map, meta)
// }

// pitch的执行顺序是从前往后，从右到左执行(就是按照use调用的顺序依次执行)
// module.exports.pitch 相对于 module.exports 会优先依次执行
module.exports.pitch = function() {
    console.log('pitch 1')
}

// 异步loader
module.exports = function(content, map, meta){
    console.log('loader111')
    // 声明异步函数
    const callback = this.async();
    // 异步调用，loader111会被异步打印 
    setTimeout(() => {
        console.log('异步回调了')
        // 还是接受4个参数：错误(没有就传null), 处理后暴露的内容content, 映射关系map，元信息meta，可以省略三四参数
        callback(null, content)
    }, 1000)
}