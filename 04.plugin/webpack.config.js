//  引入自定义插件
const Plugin1 = require('./plugins/Plugin1')
const Plugin2 = require('./plugins/Plugin2')
//  自己写一个拷贝插件
const CopyWebpackPlugin = require('./plugins/CopyWebpackPlugin')
module.exports = {
    plugins:[
        //  new 调用必然是一个构造函数或者class
        // new Plugin1()
        // new Plugin2()
        new CopyWebpackPlugin({
            from: 'public',
            to: 'css',
            ignore: ['**/index.html']
        })
    ],
    //  现在这个版本调用需要指明mode
    mode:'production'
}