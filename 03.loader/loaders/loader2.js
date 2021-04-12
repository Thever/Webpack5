// loader本质上是一个函数
// 接受3个参数，内容，map映射信息，meta元信息
module.exports = function(content, map, meta){
    console.log('loader2')
    console.log(content)
    // 返回处理好的内容
    return content;
}

// pitch的执行顺序是从前往后，从右到左执行(就是按照use调用的顺序依次执行)
// module.exports.pitch 相对于 module.exports 会优先依次执行
module.exports.pitch = function() {
    console.log('pitch 2')
}