/* 自己写个babelLoader */
// 获取传入的参数
const { getOptions } = require('loader-utils')
// 获取校验方法
const { validate } =  require('schema-utils')
// 获取校验文件
const babelSchema = require('./babelSchema.json')
// 获得babel做编译
const babel = require('@babel/core')
// 获取处理异步的工具函数
const util = require('util')
// 将普通的异步函数转换成promise方法
// babel.transform用来编译代码，是一个普通异步方法
// util.promisify将普通异步转换成基于promise的异步方法
const transform = util.promisify(babel.transform)


module.exports = function(content, map, meta){
    // 获取loader的options配置, 没有传入的话就位空对象
    const options = getOptions(this) || {}
    // 校验babel的options配置
    validate(babelSchema, options, {
        name:'Babel Loader'
    });
    // 创建一个异步loader
    const callback = this.async();
    // 使用babel编译代码
    transform(content, options)
        .then(({code, map}) => callback(null, code, map, meta))
        .catch((e) => callback(e))
}