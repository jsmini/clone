import { type } from '@jsmini/type';

// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

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
            if (hasOwnProp(x, key)) {
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
    const t = type(x);

    let root = x;

    if (t === 'array') {
        root = [];
    } else if (t === 'object') {
        root = {}
    }

    // 循环数组
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x,
        }
    ];

    while(loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;
        const tt = type(data);

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = tt === 'array' ? [] : {};
        }

        if (tt === 'array') {
            for (let i = 0; i < data.length; i++) {
                // 避免一层死循环 a.b = a
                if (isClone(data[i]) && data !== data[i]) {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: i,
                        data: data[i],
                    });
                } else {
                    res[i] = data[i];
                }
            }
        } else if (tt === 'object'){
            for(let k in data) {
                if (hasOwnProp(data, k)) {
                    // 避免一层死循环 a.b = a
                    if (isClone(data[k]) && data !== data[k]) {
                        // 下一次循环
                        loopList.push({
                            parent: res,
                            key: k,
                            data: data[k],
                        });
                    } else {
                        res[k] = data[k];
                    }
                }
            }
        }
    }

    return root;
}

function find(arr, item) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) return arr[i];
    }

    return null;
}
// 保持引用关系
export function cloneForce(x) {
    const uniqueList = []; // 用来去重
    const t = type(x);

    let root = x;

    if (t === 'array') {
        root = [];
    } else if (t === 'object') {
        root = {}
    }

    // 循环数组
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x,
        }
    ];

    while(loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;
        const tt = type(data);

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = tt === 'array' ? [] : {};
        }

        // 数据已经存在
        let uniqueData;
        if (uniqueData = find(uniqueList, x)) {
            res = uniqueData.target;
            break; // 中断本次循环
        }

        // 数据不存在
        // 保存源数据，在拷贝数据中对应的引用
        uniqueList.push({
            source: x,
            target: res,
        });

        if (tt === 'array') {
            for (let i = 0; i < data.length; i++) {
                if (isClone(data[i])) {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: i,
                        data: data[i],
                    });
                } else {
                    res[i] = data[i];
                }
            }
        } else if (tt === 'object'){
            for(let k in data) {
                if (hasOwnProp(data, k)) {
                    if (isClone(data[k])) {
                        // 下一次循环
                        loopList.push({
                            parent: res,
                            key: k,
                            data: data[k],
                        });
                    } else {
                        res[k] = data[k];
                    }
                }
            }
        }
    }

    return root;
}
