//  用来演示compilation处理内容
const fs = require('fs')
const util = require('util')
//  将fs.readFile方法变成基于promise风格的异步方法
const readFile = util.promisify(fs.readFile)
//
const webpack = require('webpack')
//  sources在webpack4中是一个库，在webpack5中已经整合到内部属性里了
const {RawSource} = webpack.sources

//  引入绝对路径
const path = require('path')

/*
  1. 初始化compilation钩子
  2. 往要输出资源中，添加一个a.txt文件
  3. 读取b.txt中的内容，将b.txt中的内容添加到输出资源中的b.txt文件中
      3.1 读取b.txt中的内容需要使用node的readFile模块
      3.2  将b.txt中的内容添加到输出资源中的b.txt文件中除了使用 2 中的方法外，还有两种形式可以使用
          3.2.1 借助RawSource
          3.2.2 借助RawSource和emitAsset
*/

//  每个plugin都是一个类
class Plugin2 {
    //  使用complier调用hooks
    apply(compiler){
        //  thisCompilation 初始化compilation
        compiler.hooks.thisCompilation.tap('Plugin2', (compilation) => {
            // debugger
            // console.log(compilation)

            //  异步添加资源,如果需要输出外部文件需要异步读取输出
            compilation.hooks.additionalAssets.tapAsync('Plugin2',async(cb) => {
                // debugger
                // console.log(compilation)
                //  定义返回内容
                const content = 'hello plugin2'
                //  往要输出的资源中,添加一个a.txt文件,手动指定不方便
                compilation.assets['a.txt'] = {
                    //  指定文件大小
                    size(){
                        return content.length
                    },
                    //  指定文件内容
                    source(){
                        return content
                    }
                }
                //  使用绝对路径来读取内容
                const data =  await readFile(path.resolve(__dirname, 'b.txt'))
                //  自动读取内容添加输出文件b.txt
                compilation.assets['b.txt'] =  new RawSource(data)
                //  调用回调执行完成
                cb();
            })
        })
    }

}

module.exports =  Plugin2;