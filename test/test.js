var expect = require('expect.js');

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
                var temp = cloneForce(normalList[i].a);
                
                // 确保不全等
                expect(temp).not.to.be(normalList[i].a);
                // 确保内容一样
                expect(temp).to.eql(normalList[i].a);
            }
        });

        it('简单循环引用', function() {
            var temp = cloneForce(singleRefList[0].a);
            expect(temp).to.be(temp[3]);

            var temp = cloneForce(singleRefList[1].a);
            expect(temp).to.be(temp['a4']);
        });

        it('复杂循环引用', function() {
            var temp = cloneForce(complexRefList[0].a);
            expect(temp).to.be(temp[1][1]);

            var temp = cloneForce(complexRefList[1].a);
            expect(temp).to.be(temp.a2.b2);
        });
    });
});
