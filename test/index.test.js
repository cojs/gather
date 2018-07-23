'use strict';

const sleep = require('mz-modules/sleep');
const assert = require('assert');
const gather = require('../');

const gfun = function* (result, error, interval) {
  yield sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

const afun = async function(result, error, interval) {
  await sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

describe('co-gather', () => {
  it('should generator work', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1),
      gfun(2),
      gfun(3),
    ], 2);
    const use = Date.now() - start;
    assert.deepEqual(res, [ { value: 1 }, { value: 2}, { value: 3} ]);
    around(use, 200);
  });

  it('should work out of order', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1, null, 500),
      gfun(2, null, 100),
      gfun(3, null, 200),
    ], 2);
    const use = Date.now() - start;
    assert.deepEqual(res, [{ value: 1 }, { value: 2 }, { value: 3 }]);
    around(use, 500);
  });

  it('should work when length < n', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1),
      gfun(2),
      gfun(3),
    ]);
    const use = Date.now() - start;
    assert.deepEqual(res, [{ value: 1 }, { value: 2 }, { value: 3 }]);
    around(use, 100);
  });

  it.only('should work when n = 1', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1),
      gfun(2),
      gfun(3),
    ]);
    const use = Date.now() - start;
    assert.deepEqual(res, [{ value: 1 }, { value: 2 }, { value: 3 } ]);
    around(use, 300);
  });
});

function around(a, b) {
  if (Math.abs(a - b) < 20) return;
  throw new Error(`${a} is not around ${b}`);
}
