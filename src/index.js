import { type } from '@jsmini/type';


// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x) {
    const t = type(x);
    return t === 'object' || t === 'array' || t === 'set' || t === 'map';
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
            res[i] = x[i] === x ? res: clone(x[i]);
        }
    } else if (t === 'object') {
        res = {};
        for(let key in x) {
            if (hasOwnProp(x, key)) {
                // 避免一层死循环 a.b = a
                res[key] = x[key] === x ? res : clone(x[key]);
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
            try {
                // ie8无console
                console.error('cloneJSON error: ' + e.message);
            // eslint-disable-next-line no-empty
            } catch(e) {}
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
        root = {};
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
                if (data[i] === data) {
                    res[i] = res;
                } else if (isClone(data[i])) {
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
                    if (data[k] === data) {
                        res[k] = res;
                    } else if (isClone(data[k])) {
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

const UNIQUE_KEY = 'com.yanhaijing.jsmini.clone' + (new Date).getTime();
const UNIQUE_SET_KEY = 'com.yanhaijing.jsmini.clone.set' + (new Date).getTime();
const UNIQUE_MAPKEY_KEY = 'com.yanhaijing.jsmini.clone.mapkey' + (new Date).getTime();
const UNIQUE_MAPVALUE_KEY = 'com.yanhaijing.jsmini.clone.mapvalue' + (new Date).getTime();



// weakmap：处理对象关联引用
function SimpleWeakmap (){
    this.cacheArray = [];
}

SimpleWeakmap.prototype.set = function(key, value){
    this.cacheArray.push(key);
    key[UNIQUE_KEY] = value;
};
SimpleWeakmap.prototype.get = function(key){
    return key[UNIQUE_KEY];
};
SimpleWeakmap.prototype.clear = function(){
    for (let i = 0; i < this.cacheArray.length; i++) {
        let key = this.cacheArray[i];
        delete key[UNIQUE_KEY];
    }
    this.cacheArray.length = 0;
};

function getWeakMap(){
    let result;
    if(typeof WeakMap !== 'undefined' && type(WeakMap)== 'function'){
        result = new WeakMap();
        if(type(result) == 'weakmap'){
            return result;
        }
    }
    result = new SimpleWeakmap();

    return result;
}

function setValueToParent(parent,key,value){
    
    if(key === UNIQUE_SET_KEY){
        parent.add(value);
    }else if(key == UNIQUE_MAPVALUE_KEY){ //控制数据循环的顺序，先添加value，再添加key
        parent.set(UNIQUE_MAPKEY_KEY,value);
    }else if(key == UNIQUE_MAPKEY_KEY){
        parent.set(value,parent.get(UNIQUE_MAPKEY_KEY));
        parent.delete(UNIQUE_MAPKEY_KEY);
    }else{
        parent[key] = value;
    }
    return value;
}


//检测Set功能
const checkSet = (function(){
    try {
        let set = new Set();
        set.add(UNIQUE_KEY);

        if(set.has(UNIQUE_KEY)){

            set.delete(UNIQUE_KEY);
            return true;
        }
    } catch (e) {
        console.log(e.message);
    }
    return false;
})();
//检测Map的功能
const checkMap = (function(){
    try {
        let map = new Map();
        map.set(UNIQUE_KEY,'Map');

        if(map.has(UNIQUE_KEY) && map.get(UNIQUE_KEY) == 'Map'){

            map.delete(UNIQUE_KEY);
            return true;
        }
        map.delete(UNIQUE_KEY);
    } catch (e) {
        console.log(e.message);
    }
    return false;
})();

export function cloneForce(x) {
    const uniqueData = getWeakMap();

    let root = {
        next:x
    };

    // 循环数组
    const loopList = [
        {
            parent: root,
            key: 'next',
            data: x,
        }
    ];

    while(loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const source = node.data;
        const tt = type(source);

        // 复杂数据需要缓存操作
        if (isClone(source)) {
            // 命中缓存，直接返回缓存数据
            let uniqueTarget = uniqueData.get(source);
            if (uniqueTarget) {
                setValueToParent(parent,key,uniqueTarget);
                continue; // 中断本次循环
            }
        }

        let newValue;
        if (tt === 'array') {
            newValue = setValueToParent(parent,key,[]);
            for (let i = 0; i < source.length; i++) {
                // 下一次循环
                loopList.push({
                    parent: newValue,
                    key: i,
                    data: source[i],
                });
            }
        } else if (tt === 'object'){
            newValue = setValueToParent(parent,key,{});
            for(let k in source) {
                if(k === UNIQUE_KEY) continue;
                if (hasOwnProp(source, k)) {
                    // 下一次循环
                    loopList.push({
                        parent: newValue,
                        key: k,
                        data: source[k],
                    });
                }
            }
        } else if (tt === 'set' && checkSet){
            newValue = setValueToParent(parent,key,new Set());
            for (let s of source){
                // 下一次循环
                loopList.push({
                    parent: newValue,
                    key: UNIQUE_SET_KEY,
                    data: s,
                });
            }
        } else if (tt === 'map' && checkMap){
            newValue = setValueToParent(parent,key,new Map());
            for (let m of source){
                // 下一次循环
                //先添加key， 再添加value 和 setValueToParent里保持一致
                loopList.push({
                    parent: newValue,
                    key: UNIQUE_MAPKEY_KEY,
                    data: m[0],
                });
                loopList.push({
                    parent: newValue,
                    key: UNIQUE_MAPVALUE_KEY,
                    data: m[1],
                });
            }
        } else{
            setValueToParent(parent,key,source);
            continue;
        }

        // 未命中缓存，保存到缓存
        uniqueData.set(source, newValue);

    }
    

    uniqueData.clear && uniqueData.clear();
    
    return root.next;
}


