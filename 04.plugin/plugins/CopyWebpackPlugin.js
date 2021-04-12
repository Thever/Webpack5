//  使用schema-utils 库中的 validate 方法来验证
const { validate } = require('schema-utils')
//  引入使用规则
const schema = require('./schema.json')
//  glpbby用来匹配文件列表
const globby = require('globby')
//  path模块用来判断是否为绝对路径
const path = require('path')
//  引入fs模块来读取内容
const fs = require('fs')
const {promisify} = require('util')
//  将fs.readFile方法变成基于promise风格的异步方法
const readFile = promisify(fs.readFile)

//  引入webpack方法
const webpack =  require('webpack')
const {RawSource} = webpack.sources

class CopyWebpackPlugin{
    constructor(options = {}){
        //  验证options是否符合规范
        //  参数依次为：验证规范，传入的option 和 验证的插件名
        validate(schema, options, {
            name:'CopyWebpackPlugin'
        })

        this.options = options;
    }
    //  设置回调方法
    apply(compiler){
        //  初始化compilation时处理
        compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
            //  在添加资源的hooks
            compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async (cb) => {
                //  将from中的资源复制到to中，输出出去
                //  获取必定会有的值
                const { from, ignore } = this.options
                //  获取可能存在的值
                const to = this.options.to ? this.options.to : '.';

                //  1.读取from中所有资源, 过滤掉ignore的文件
                //  context就是webpack配置,运行指令的目录
                const context = compiler.options.context // 等价与process.cwd()
                //  将输入路径变为绝对路径
                const absoluteFrom = path.isAbsolute(from) ? from : path.resolve(context, from);
                console.log(`absoluteFrom`, absoluteFrom)
                console.log(`ignore`,ignore)
                console.log(`{ignore}`, {ignore})
                //  globby(要处理的文件夹(需要绝对路径)，忽略条件)
                let paths = await globby(absoluteFrom, { ignore });
                //  写这个代码的工作电脑打印出来为空数组， globby传入的内容都是正确的，可能和命令行或者node版本有关系？？？
                //  为了流程直接手动写死,如果打印出来内容正常的话可以对下面这行代码进行注释
                paths = [
                    absoluteFrom+`\\reset.css`
                ];
                console.log(`paths`, paths)  //  所有要加载的文件路径数组,
    
                //  2.过滤掉ignore的文件
                const files = await Promise.all(
                    paths.map(async (absolutePath) => {
                        //  读取文件内容
                        const data = await readFile(absolutePath)
                        //  读取文件名称,basename得到最后的文件名称
                        const relativePath = path.basename(absolutePath)
                        // 和to属性结合
                        // 没有to --> reset.css
                        // 有to --> css/reset.css
                        const filename = path.join(to, relativePath)
                        
                        //  返回文件
                        return {
                            data,
                            filename
                        }
                    })
                )

                //  3.生成webpack格式的资源
                const assets = files.map((file) => {
                    const source = new RawSource(file.data)
                    return {
                        source,
                        filename:file.filename
                    }
                })
                //  4.添加compilation中，输出出去
                assets.forEach((asset) => {
                    compilation.emitAsset(asset.filename, asset.source)
                })

                cb();
            })
        })
    }
}
module.exports = CopyWebpackPlugin
