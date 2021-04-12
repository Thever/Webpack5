// 获取option需要loader-utils库
const {getOptions} = require('loader-utils')
// 引入库获取验证规则
const {validate} = require('schema-utils')
// 导入验证规则文件
const scheme = require('./schema.json')

// loader本质上是一个函数
// 接受3个参数，内容，map映射信息，meta元信息
module.exports = function(content, map, meta){
    console.log('loader3')

    // 调用方法获取options
    const options = getOptions(this)
    // 打印内容
    console.log(options)
    // 校验内容是否合法
    // validate()方法传入校验规则，校验内容和loader名字
    validate(scheme, options, {
        name:'loader3'
    })
    console.log(content)
    // 返回处理好的内容
    return content;
}
// pitch的执行顺序是从前往后，从右到左执行(就是按照use调用的顺序依次执行)
// module.exports.pitch 相对于 module.exports 会优先依次执行
module.exports.pitch = function() {
    console.log('pitch 3')
}