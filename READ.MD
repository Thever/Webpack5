# 代码依赖环境参考
@vue/cli v4.5.7
creact-react-app v3.4.1
webpack v5.1.3（我用的是5.12.3）
node.js v12.17.0（我用的是14.4.0）

# 环境大版相同，版本更高级也可，最好一致 

# react脚手架 create-react-app 

# 创建项目01.react_cli
# npx create-react-app 01.react_cli

# 暴露creae-react-app 的webpack配置，注意该操作不可逆，操作后 react-scripts 命令主体也会变成 node
# npm run eject

# creact-react-app 默认打包
# "build": "node scripts/build.js",

# 安装 cross-env 用来设置运行时环境变量
# npm i cross-env --dev

# 使用 cross-env 来 声明 env 中 GENERATE_SOURCEMAP 为 false, 并打包
# "build-no-sourcemap": "cross-env GENERATE_SOURCEMAP=false node scripts/build.js",

# 使用@vue/cli脚手架来创建vue2项目
# vue create 02.vue_cli
# 选择 Default([Vue 2] babel, eslint)

# vue没有暴露webpack配置的方法，可以通过 inspect 方法暴露出来
# vue inspect --mode=development > webpack.dev.js
# 暴露 mode development 的配置到 webpack.dev.js 文件中, 暴露开发环境配置
# vue inspect --mode=production > webpack.prod.js
# 暴露 mode production 的配置到 webpack.prod.js 文件中，暴露生成环境配置

# 创建自定义loader文件夹 03.loader
# 以为webpack会使用默认值打包，npx webpack
# 发现直接报错 [webpack-cli] Failed to load 'C:\Users\Administrator\Desktop\code\03.loader\webpack.config.js' config
# 上stack overflow看了下，打包指定配置文件 npx webpack --config=webpack.config.js
# 使用的js被加载了，友好提示要指定mode才能使用webpack5默认值
# 在配置文件中指定mode后，用npx webpack就能使用默认值打包了

# 安装loader-utils库来获取loader传入的参数
# npm i loader-utils -D
# 使用方法
# const {getOptions} = require('loader-utils')
module.exports = function(content, map, meta){
    //  调用方法获取options
    const options = getOptions(this)
    console.log(options)
    console.log(content)
    // 返回处理好的内容
    return content;
}

# 安装schema-utils库来验证传入的内容
# npm i loader-utils -D
# 引入库获取验证规则
# const {validate} = require('schema-utils')
# 创建验证文件 schema.json
{
    // 类型为对象
    "type":"object",
    // 验证的属性
    "properties":{
        // 验证name属性，string
        "name":{
            "type":"string",
            "description":"测试的属性姓名"
        }
    },
    // 是否运行添加新的属性
    "additionalProperties": true
}
# 对传入的内容进行验证
module.exports = function(content, map, meta){
    console.log('loader3')

    // 调用方法获取options
    const options = getOptions(this)
    // 打印内容
    console.log(options)
    // 校验内容是否合法
    // validate()方法传入校验规则，校验内容和loader名称
    validate(scheme, options, {
        name:'loader3'
    })
    console.log(content)
    // 返回处理好的内容
    return content;
}

# webpack中的钩子与生命周期类似，可以监听webpack过程中的各个状态
# Tapable的具体配置可以参考Tapable文档 https://github.com/webpack/tapable#tapable

# plugin文件夹中的文件，可以用node命令直接运行查看结果

# Webpack 执行流程

1. 初始化 Compiler：webpack(config) 得到 Compiler 对象
2. 开始编译：调用 Compiler 对象 run 方法开始执行编译
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，递归直到所有模块被加载进来
5. 完成模块编译： 在经过第 4 步使用 Loader 编译完所有模块后，得到了每个模块被编译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表。（注意：这步是可以修改输出内容的最后机会）
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
