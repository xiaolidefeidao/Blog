//本例实现了一个自定义事件发布订阅中心 EventEmitter，
//EventEmitter 实例拥有 getMaxListeners、setMaxListeners、$on、$once、$off、$emit 6 个接口
//在事件的订阅、发布、取消过程中都可以传入多个回调函数

class EventEmitter {
    constructor(num = 10) {
        this.maxListeners = num;
        this.$events = new Map();
    }

    getMaxListeners() {
        return this.maxListeners;
    }

    setMaxListeners(num = 10) {
        this.maxListeners = num;
    }

    $on(event, ...cbs) {
        if (this.$events.has(event)) {
            this.$events.set(event, this.$events.get(event).concat(cbs))
        } else {
            if (this.$events.size === this.getMaxListeners()) {
                console.log('订阅失败，超出最大监听器数！')
            } else {
                this.$events.set(event, cbs)
            }
        }
    }

    $once(event, ...cbs) {
        let wraps = [];
        for (let cb of cbs) {
            function wrap() {
                cb(...arguments);
                this.$off(event, wrap)
            }

            wrap.cb = cb;
            wraps.push(wrap);
        }
        this.$on(event, ...wraps)
    }

    $off(event, ...cbs) {
        if (this.$events.has(event) === false) return;
        if (cbs.length === 0) {
            this.$events.delete(event);
            return;
        }
        let fns = this.$events.get(event);
        for (const cb of cbs) {
            fns = fns.filter(item => {
                return cb !== item && cb !== item.cb;
            })
        }
        fns.length === 0 ? this.$events.delete(event) : this.$events.set(event, fns)
    }

    $emit(event, ...args) {
        if (this.$events.has(event) === false) return;
        let fns = this.$events.get(event);
        fns.map(cb => {
            cb.call(this, ...args)
        })
    }
}

let e1 = new EventEmitter(100);

function en1() {
    "use strict";
    try {
        console.log(this.maxListeners)
    } catch (e) {
        console.log(e)
    }
    console.log('en1------------------', ...arguments);
}

function en2() {
    "use strict";
    console.log('en2------------------', ...arguments);
}

/*e1.$on('x', en1, () => {
  "use strict";
  console.log('除非 off x，否则我不会消失')
});
e1.$emit('x', 123);
e1.$once('x', () => {
  "use strict";
  console.log('once 只执行一次------------------')
}, () => {
  "use strict";
  console.log('once 只执行一次++++++++++++++++++++')
});
e1.$emit('x');
e1.$emit('x', 456);
e1.$on('x', en2);
e1.$emit('x');
e1.$off('x', en1, en2);
e1.$emit('x');
e1.$off('x');
e1.$emit('x');
console.log(e1.$events.has('x'));*/
e1.$on('x', en1)
e1.setMaxListeners(1)
e1.$once('y', en1)
e1.$emit('x')
e1.$emit('y')
