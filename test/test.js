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

    var normalList = [
        {
            a: 1,
        },
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
    describe('clone', function() {
        it('常规', function() {
            for (var i = 0; i < normalList.length; i++) {
                expect(clone(normalList[i])).to.eql(normalList[i]);
            }
        });
    });

    describe('cloneJSON', function() {
        it('常规', function() {
            for (var i = 0; i < normalList.length; i++) {
                expect(cloneJSON(normalList[i])).to.eql(normalList[i]);
            }
        });
    });

    describe('cloneLoop', function() {
        it('常规', function() {
            for (var i = 0; i < normalList.length; i++) {
                expect(cloneLoop(normalList[i])).to.eql(normalList[i]);
            }
        });
    });

    describe('cloneForce', function() {
        it('常规', function() {
            for (var i = 0; i < normalList.length; i++) {
                expect(cloneForce(normalList[i])).to.eql(normalList[i]);
            }
        });
    });
});
