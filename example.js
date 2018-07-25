'use strict';

const gather = require('./');
const sleep = require('mz-modules/sleep');

function* gfun(result, error, interval) {
  yield sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

async function afun(result, error, interval) {
  await sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

console.time('gather');
gather([
  gfun(1),
  gfun(null, 'error'),
  async () => afun(null, 'error'),
  () => afun(4),
], 2).then(res => {
  console.timeEnd('gather');
  console.log(res);
});
