'use strict';

const sleep = require('mz-modules/sleep');
const assert = require('assert');
const gather = require('../');

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

describe('co-gather', () => {
  it('should generator work', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1),
      gfun(2),
      gfun(3),
    ], 2);
    const use = Date.now() - start;
    assert.deepEqual(res, [ { isError: false, isError: false, value: 1 }, { isError: false, value: 2}, { isError: false, value: 3} ]);
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
    assert.deepEqual(res, [{ isError: false, value: 1 }, { isError: false, value: 2 }, { isError: false, value: 3 }]);
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
    assert.deepEqual(res, [{ isError: false, value: 1 }, { isError: false, value: 2 }, { isError: false, value: 3 }]);
    around(use, 100);
  });

  it('should work when n = 1', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(1),
      gfun(2),
      gfun(3),
    ], 1);
    const use = Date.now() - start;
    assert.deepEqual(res, [{ isError: false, value: 1 }, { isError: false, value: 2 }, { isError: false, value: 3 } ]);
    around(use, 300);
  });

  it('should work with error', async () => {
    const start = Date.now();
    const res = await gather([
      gfun(null, 'error'),
      gfun(null, 'error'),
      gfun(3),
    ], 1);
    const use = Date.now() - start;
    assert(res[0].isError);
    assert(res[0].error.message === 'error');
    assert(res[1].isError);
    assert(res[1].error.message === 'error');
    assert(res[2].value === 3);
    around(use, 300);
  });

  it('should work with async function', async () => {
    const start = Date.now();
    const res = await gather([
      async () => afun(null, 'error'),
      async () => afun(null, 'error'),
      async () => afun(3),
    ], 1);
    const use = Date.now() - start;
    assert(res[0].isError);
    assert(res[0].error.message === 'error');
    assert(res[1].isError);
    assert(res[1].error.message === 'error');
    assert(res[2].value === 3);
    around(use, 300);
  });

  it('should work with promise', async () => {
    const start = Date.now();
    const res = await gather([
      afun(null, 'error', 300),
      afun(null, 'error', 100),
      afun(3, null, 200),
    ], 1);
    const use = Date.now() - start;
    assert(res[0].isError);
    assert(res[0].error.message === 'error');
    assert(res[1].isError);
    assert(res[1].error.message === 'error');
    assert(res[2].value === 3);
    // notice: promise will start at once
    around(use, 300);
  });

  it('should work with empty array', async () => {
    const res = await gather([]);
    assert.deepEqual(res, []);
  });

  it('should work with undefined item', async () => {
    const res = await gather([ undefined, afun(3, null, 200) ]);
    assert.deepEqual(res, [ undefined, { value: 3, isError: false } ]);
  });
});

function around(a, b) {
  if (Math.abs(a - b) < 20) return;
  throw new Error(`${a} is not around ${b}`);
}
