var expect = require('expect.js');
var type = require('@jsmini/type').type;

var clone = require('../dist/index.js').clone;
var cloneJSON = require('../dist/index.js').cloneJSON;
var cloneLoop = require('../dist/index.js').cloneLoop;
var cloneForce = require('../dist/index.js').cloneForce;

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
        let set = new Set()
        let set1 = new Set()
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
        let set = new Set()
        let set1 = new Set()
        set.add(1)
        set.add(set1)
        set1.add({
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
        set.add(set1)
        set1.add(set)
        singleRefList.push({
            a:set,
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
        let set = new Set()
        let set1 = new Set()
        let set2 = new Set()
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

            for (var i = 0; i < normalList.length; i++) {
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
        });

        it('复杂循环引用', function() {
            var temp = cloneForce(complexRefList1[0].a);
            expect(temp).to.be(temp[1][1]);

            var temp = cloneForce(complexRefList1[3].a);
            expect(temp.has(temp)).to.be(true);

            var temp = cloneForce(complexRefList1[1].a);
            expect(temp).to.be(temp.a2.b2);
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
        });
    });
});
