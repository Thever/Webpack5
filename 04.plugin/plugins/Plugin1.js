//  用来演示compiler.hooks生命周期函数
//  每个plugin都是一个类
class Plugin1 {
    //  插件一般默认会调用apply方法，传入complier对象来提供钩子，进行不同生命周期状态内的处理
    apply(compiler){
        /* 绑定生命周期函数 */
        // compiler.hooks.emit 表示 complier的钩子触发了 emit时间
        // 'Plugin1' 表示绑定的钩子，一般绑定在默认钩子上
        // (compilation) => {...} , 表示要调用的回调函数， 传入的参数名 compilation ，可以参考wepack文档来获取返回调用
        // 文档地址：https://webpack.docschina.org/api/compiler-hooks/#emit
        compiler.hooks.emit.tap('Plugin1', (compilation) => {
            console.log('emit.tap Plugin1')
        })
        /* emit异步绑定, tapAsync */
        //  多传入一个异步参数cb
        //  compilier ==》 这个钩子的原本的执行时间额外增加了1秒，同时影响后续钩子的执行
        compiler.hooks.emit.tapAsync('Plugin1', (compilation, cb) => {
            //  定时器异步调用
            setTimeout(() => {
                console.log('emit.tapAsync Plugin1')
                cb();   //  需要调用异步参数才能执行异步
            }, 1000)
        })
        /* 也可以使用tapPromise来执行异步钩子, 没有异步参数 */
        compiler.hooks.emit.tapPromise('Plugin1', (compilation) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('emit.tapPromise')
                    resolve()   //  成功回调让程序继续执行
                }, 1000)
            })
        })
        /* 同理注册afterEmit */
        compiler.hooks.afterEmit.tap('Plugin1', (compilation) => {
            console.log('afterEmit.tap Plugin1')
        })
         /* 同理注册done */
        compiler.hooks.done.tap('Plugin1', (stats) => {
            console.log('done.tap Plugin1')
        })
    }
}

module.exports =  Plugin1;