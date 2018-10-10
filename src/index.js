import { type } from '@jsmini/type';

const emptyObj = {};

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x) {
    const t = type(x);
    return t === 'object' || t === 'array';
}

// 递归
export function clone(x) {
    if (!isClone(x)) return x;

    const t = type(x);

    let res;

    if (t === 'array') {
        res = [];
        for (let i = 0; i < x.length; i++) {
            // 避免一层死循环 a.b = a
            res[i] = x === x[i] ? x[i]: clone(x[i]);
        }
    } else if (t === 'object') {
        res = {};
        for(let key in x) {
            if (x.hasOwnProperty(key)) {
                res[key] = x === x[key] ? x[key]: clone(x[key]);
            }
        }
    }

    return res;
}

// 通过JSON深拷贝
export function cloneJSON(x, errOrDef = true) {
    if (!isClone(x)) return x;

    try {
        return JSON.parse(JSON.stringify(x));
    } catch(e) {
        if (errOrDef === true) {
            throw e;
        } else {
            console.error('cloneJSON error: ' + e.message);
            return errOrDef;
        }
    }
}

// 循环
export function cloneLoop(x) {

}

// 保持引用关系
export function cloneForce(x) {

}
