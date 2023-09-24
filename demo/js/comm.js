var clone = jsmini_clone.clone;
var cloneJSON = jsmini_clone.cloneJSON;
var cloneLoop = jsmini_clone.cloneLoop;
var cloneForce = jsmini_clone.cloneForce;

function createData(deep, breadth) {
  var data = {};
  var temp = data;

  for (var i = 0; i < deep; i++) {
    temp = temp['data'] = {};
    for (var j = 0; j < breadth; j++) {
      temp[j] = j;
    }
  }

  return data;
}

function runCount(fn, count) {
  var time = Date.now();
  while (count--) {
    fn();
  }

  return Date.now() - time;
}

function runTime(fn, time) {
  var stime = Date.now();
  var count = 0;
  while (Date.now() - stime < time) {
    fn();
    count++;
  }

  return count;
}

function safeRun(name, fn) {
  console.log(name, ' start');

  var time = Date.now();

  try {
    fn();
  } catch (e) {
    console.log(e.message);
  }

  time = Date.now() - time;

  console.log(name, ' end，耗时: ', time);
  return time;
}
