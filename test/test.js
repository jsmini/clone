var expect = require('expect.js');
var type = require('@jsmini/type').type;

var clone = require('../src/index.js').clone;
var cloneJSON = require('../src/index.js').cloneJSON;
var cloneLoop = require('../src/index.js').cloneLoop;
var cloneForce = require('../src/index.js').cloneForce;

function stringify(x) {
    return JSON.stringify(x);
}

describe('单元测试', function() {
    this.timeout(1000);

    // 简单值
    var simpleList = [
        {
            a: 1
        },
        {
            a: 'abc'
        },
        {
            a: true
        },
        {
            a: null
        }
    ];

    

    // 正常cases
    var normalList = [
        {
            a: [],
        },
        {
            a: [1, 2, 3],
        },
        {
            a: [1, [2, [3]]],
        },
        {
            a: {},
        },
        {
            a: {a: 1, b: 2, c: 3},
        },
        {
            a: {a1: 1, a2: {b1: 1, b2: {c1: 1, c2: 2}}},
        },
        {
            a: {a1: 1, a2: [1, {b1: 1, b2: [{c1: 1, c2: 2}]}]}
        }
    ];

    //添加set数据
    try {
        var normalList1 = [
            {
                a: [],
            },
            {
                a: [1, 2, 3],
            },
            {
                a: [1, [2, [3]]],
            },
            {
                a: {},
            },
            {
                a: {a: 1, b: 2, c: 3},
            },
            {
                a: {a1: 1, a2: {b1: 1, b2: {c1: 1, c2: 2}}},
            },
            {
                a: {a1: 1, a2: [1, {b1: 1, b2: [{c1: 1, c2: 2}]}]}
            }
        ];
        var set = new Set()
        var set1 = new Set()
        set.add(1)
        set.add(set1)
        set.add({
            a: 1,
            a1:[set1],
            a2:{
                a:[set1]
            }
        })
        set.add([
            'abc'
        ])
        set.add(null)
        set.add(undefined)
        normalList1.push({
            a:set,
        })

        var map = new Map()
        var obj = {}
        map.set(1,1)
        map.set(2,'a')
        map.set('a',null)
        map.set('b',1)
        map.set(4,undefined)
        map.set({},1)
        map.set(obj,obj)
        normalList1.push({
            a:map,
        })
    } catch (error) {
        
    }

    // 父子循环引用
    var a = [1, 2, 3];
    a.push(a);

    var b = {a1: 1, a2: 2, a3: 3};
    b.a4 = b;
    var singleRefList = [
        {
            a: a,
        },
        {
            a: b,
        },
        {
            a: b,
        }
    ];

    //添加set数据
    try {
        var singleRefList1 = [
            {
                a: a,
            },
            {
                a: b,
            },
            {
                a: b,
            }
        ];
        var set = new Set()

        set.add(set)

        var set1 = new Set()

        set1.add(set)

        singleRefList1.push({
            a:set,
        })
        singleRefList1.push({
            a:set1,
        })

        var map = new Map()
        map.set('a',map)

        map.set(map,'a')        

        var map1 = new Map()

        map1.set('a',{
            'a4':map1
        })
        map1.set({
            'a4':map1
        },'a')

        singleRefList1.push({
            a:map,
        })
        singleRefList1.push({
            a:map1,
        })
    } catch (error) {
        
    }

    // 多层级循环引用
    var a = [1, [2]];
    a[1].push(a);

    var b = {a1: 1, a2: {b1: 1}};
    b.a2.b2 = b;
    var complexRefList = [
        {
            a: a,
        },
        {
            a: b,
        },
        {
            a: b,
        }
    ];
    //添加set数据
    try {
        var complexRefList1 = [
            {
                a: a,
            },
            {
                a: b,
            },
            {
                a: b,
            }
        ];
        var set = new Set()
        var set1 = new Set()
        var set2 = new Set()
        set.add(set)
        
        complexRefList1.push({
            a:set
        })
        set1.add(set2)
        set2.add({
            b:set1
        })
        set2.add(set1)
        complexRefList1.push({
            a:set1
        })


        var map = new Map()
        var map1 = new Map()
        var map2 = new Map()
        map1.set('b',map2)
        map1.set('a',map)
        map1.set(map,'a')
        map.set('a',map1)
        map.set(map1,'b')
        complexRefList1.push({
            a:map
        })
    } catch (error) {
        
    }
    describe('clone', function() {
        it('常规', function() {
            for (var i = 0; i < simpleList.length; i++) {
                // 确保全等
                expect(clone(simpleList[i].a)).to.be(simpleList[i].a);
            }

            for (var i = 0; i < normalList.length; i++) {
                var temp = clone(normalList[i].a);
                
                // 确保不全等
                expect(temp).not.to.be(normalList[i].a);
                // 确保内容一样
                expect(temp).to.eql(normalList[i].a);
            }
        });

        it('简单循环引用', function() {
            var temp = clone(singleRefList[0].a);
            expect(temp).to.be(temp[3]);

            var temp = clone(singleRefList[1].a);
            expect(temp).to.be(temp['a4']);
        });
    });

    describe('cloneJSON', function() {
        it('常规', function() {
            for (var i = 0; i < simpleList.length; i++) {
                // 确保全等
                expect(cloneJSON(simpleList[i].a)).to.be(simpleList[i].a);
            }

            for (var i = 0; i < normalList.length; i++) {
                var temp = cloneJSON(normalList[i].a);
                
                // 确保不全等
                expect(temp).not.to.be(normalList[i].a);
                // 确保内容一样
                expect(temp).to.eql(normalList[i].a);
            }
        });
    });

    describe('cloneLoop', function() {
        it('常规', function() {
            for (var i = 0; i < simpleList.length; i++) {
                // 确保全等
                expect(cloneLoop(simpleList[i].a)).to.be(simpleList[i].a);
            }

            for (var i = 0; i < normalList.length; i++) {
                var temp = cloneLoop(normalList[i].a);
                
                // 确保不全等
                expect(temp).not.to.be(normalList[i].a);
                // 确保内容一样
                expect(temp).to.eql(normalList[i].a);
            }
        });

        it('简单循环引用', function() {
            var temp = cloneLoop(singleRefList[0].a);
            expect(temp).to.be(temp[3]);

            var temp = cloneLoop(singleRefList[1].a);
            expect(temp).to.be(temp['a4']);
        });
    });

    describe('cloneForce', function() {
        it('常规', function() {
            for (var i = 0; i < simpleList.length; i++) {
                // 确保全等
                expect(cloneForce(simpleList[i].a)).to.be(simpleList[i].a);
            }

            for (var i = 0; i < normalList1.length; i++) {
                var temp = cloneForce(normalList1[i].a);
                // 确保不全等
                expect(temp).not.to.be(normalList1[i].a);
                // 确保内容一样
                expect(temp).to.eql(normalList1[i].a);
            }
        });

        it('简单循环引用', function() {
            var temp = cloneForce(singleRefList1[0].a);
            expect(temp).to.be(temp[3]);

            var temp = cloneForce(singleRefList1[1].a);
            expect(temp).to.be(temp['a4']);

            //set数据检测
            if(singleRefList1[3]){
                var temp = cloneForce(singleRefList1[3].a);
                expect(temp.has(temp)).to.be(true);
                var temp1 = cloneForce(singleRefList1[4].a);
                expect(temp1.has(temp1)).not.to.be(true);
            }

            //map数据检测

            if(singleRefList1[5]){
                var temp = cloneForce(singleRefList1[5].a);
                expect(temp.has(temp)).to.be(true);
                expect(temp.has(temp.get('a'))).to.be(true);

                var temp = cloneForce(singleRefList1[6].a);
                // expect(temp.has(temp)).to.be(true);
                expect(temp.get('a')['a4']).to.be(temp);
            }
            
            
        });

        it('复杂循环引用', function() {
            var temp = cloneForce(complexRefList1[0].a);
            expect(temp).to.be(temp[1][1]);


            var temp = cloneForce(complexRefList1[1].a);
            expect(temp).to.be(temp.a2.b2);

            //set数据的检测
            if (complexRefList1[3]){
                var temp = cloneForce(complexRefList1[3].a);
                expect(temp.has(temp)).to.be(true);
                var temp = cloneForce(complexRefList1[4].a);
                var values = temp.values()
                var temp1 = values.next().value
                values = temp1.values()
                var value1 = values.next().value
                var value2 = values.next().value
                
                if (type(value1) == 'object'){
                    expect(temp).to.be(value1.b);
                    expect(temp).to.be(value2);
                    
                }else{
                    expect(temp).to.be(value2.b);
                    expect(temp).to.be(value1);
                }
            }

            //map数据检测 

            if(complexRefList1[5]){
                
                var temp = cloneForce(complexRefList1[5].a);
            
                expect(temp.get('a').get('a')).to.be(temp);
                expect(temp.get('a').get('b')).not.to.be(temp);
                expect(temp.get(temp.get('a'))).to.be('b')
                expect(temp.get('a').get(temp.get('a').get('a'))).to.be('a')
            }

        });
    });
});
