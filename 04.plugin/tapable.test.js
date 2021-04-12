// 引入钩子
const { SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable')

class Lesson{
    constructor(){
        // 初始化hook容器
        this.hooks = {
            // 同步钩子,依次执行
            // SyncHook就算有返回值，也会执行全部的函数
            go: new SyncHook(['address']),
            // SyncBailHook中只有函数有返回值，就会停止执行，跳出
            see: new SyncBailHook(['age']),
            // 异步钩子
            // AsyncParallelHook,异步并行钩子，
            leave: new AsyncParallelHook(['name','sex']),
            // AsyncSeriesHook,异步并行钩子
            set: new AsyncSeriesHook(['goal','now'])
        }
    }
    tap() {
        // 往hooks容器中注册事件 / 添加回调函数
        // 会依次触发内部的同/异步函数
        this.hooks.go.tap('ningbo', (address) => {
            console.log('ningbo', address)
            return 6
        })
        this.hooks.go.tap('hangzhou', (address) => {console.log('hangzhou', address)})
    }
    start(){
        // 触发hooks,调用内部
        this.hooks.go.call('宁波')
    }
    see(){
        this.hooks.see.tap('see', (age) => {
            console.log('18',age)
            // 同步钩子遇到返回值就不会执行了，和函数一样
            return 66
        })
        this.hooks.see.tap('see', (age) => {console.log('18',age)})
    }
    goSee(){
        this.hooks.see.call(200)
    }
    leave(){
        //  AsyncParallelHook异步函数不会阻塞
        //  tapAsync写异步函数，传入必要的name, age参数外，可添加callback回调函数
        this.hooks.leave.tapAsync('leave', (name, age, callback) => {
            setTimeout(() => {
                //  打印参数
                console.log('leave', name, age)
                //  执行回调函数
                callback()
            }, 2000)
        })
        //  tapPromise写异步函数，不需要传入回调函数，但是需要返回一个promise对象
        this.hooks.leave.tapPromise('leave2', (name, age) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    //  打印参数
                    console.log('leave2', name, age);
                    resolve()
                }, 1000)
            })
        })
    }
    goLeave(){
        // 同步调用leave中所有的异步函数
        this.hooks.leave.callAsync('jojo',18, function(){
            // 回调函数只有等leave容器中函数触发完了，才触发
            console.log('leave容器中函数触发完了')
        })
    }
    set(){
        //  tapAsync写异步函数，传入必要的name, age参数外，可添加callback回调函数
        this.hooks.set.tapAsync('set', (goal, set, callback) => {
            setTimeout(() => {
                //  打印参数
                console.log('set', goal, set)
                //  执行回调函数
                callback()
            }, 2000)
        })
        //  tapPromise写异步函数，不需要传入回调函数，但是需要返回一个promise对象
        this.hooks.set.tapPromise('set2', (goal, set) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    //  打印参数
                    console.log('set2', goal, set);
                    resolve()
                }, 1000)
            })
        })
    }
    goSet(){
        // 同步调用set中所有的异步函数
        this.hooks.set.callAsync('jojo',18, function(){
            // 回调函数只有等leave容器中函数触发完了，才触发
            console.log('set容器中函数触发完了')
        })
    }
}
//  调用SyncHook
// const l = new Lesson();
// l.tap();
// l.start();

//  调用SyncBailHook
// const l2 = new Lesson();
// l2.see();
// l2.goSee();

//  调用AsyncParallelHook
// const l3 = new Lesson();
// l3.leave();
// l3.goLeave()

//  调用AsyncSeriesHook
const l4 = new Lesson();
l4.set();
l4.goSet();