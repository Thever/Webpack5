const path = require('path');

module.exports = {
    // webpack5默认有entry,output配置
    module:{
        rules:[
            {
                // 处理.js文件
                test:/\.js$/,
                /* 使用单个loader */
                // 没写resolveLoader配置，指定使用的loader为根目录下，loaders文件夹中，loader1文件
                // loader: path.resolve(__dirname, 'loaders', 'loader1')
                // 写了resolveLoader modules 配置，直接写文件名
                // loader: 'loader1'
                /* 使用多个loader, 执行顺序从后往前，从右到左 */
                // use:[
                //     'loader1','loader2','loader3'
                // ]
                /* loader配置options选项 */
                // use:[
                //     'loader1',
                //     'loader2',
                //     {
                //         loader:'loader3',
                //         options:{
                //             name:'jojo',
                //             age:18
                //         }
                //     }
                // ]
                /* 使用自己写的babelLoader */
                loader:'babelLoader',
                options:{
                    presets:[
                        '@babel/preset-env'
                    ]
                }
            }
        ]
    },
    // 配置loader解析规则
    resolveLoader:{
        // 指定寻找包路径范围
        modules:[
            // 默认值，会从node_modules中找包
            'node_modules',
            // 添加自定义的loaders文件夹
            path.resolve(__dirname, 'loaders')
        ]
    },
    mode:'production'
}