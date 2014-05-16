
var gather = require('./');
var wait = require('co-wait');
var co = require('co');

var index = 0;
function *random() {
  var i = index++;
  yield wait(Math.random() * 100);
  if (Math.random() > 0.5) {
    throw new Error('error');
  }
  return i;
}

co(function *() {
  var thunks = [
    random,
    random,
    random,
    random,
    random
  ];
  var ret = yield gather(thunks);
  console.log(ret);
})();
