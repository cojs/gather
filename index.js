'use strict';

const assert = require('assert');

module.exports = function (funcs, n) {
  assert(Array.isArray(funcs), 'funcs must be array');
  n = n || 5;
  // if funcs contians promise, gather can't limit the concurrency
  if (funcs.some(func => func && typeof func.then === 'function')) n = funcs.length;

  return new Promise(resolve => {
    if (funcs.length === 0) return resolve([]);

    const results = [];
    let index = 0;
    let finish = 0;
    for (let i = 0; i < n; i++) {
      run();
    }

    function run() {
      const i = index++;
      if (i >= funcs.length) return;
      let ins = funcs[i];
      if (!ins) {
        results[i] = undefined;
        if (++finish >= funcs.length) return resolve(results);
        return;
      }

      if (typeof ins === 'function') ins = ins();
      if (ins && typeof ins.next === 'function' && typeof ins.throw === 'function') ins = require('co')(ins);
      ins.then(res => {
          results[i] = { value: res, isError: false };
        }, err => {
          results[i] = { error: err, isError: true };
          results[i].isError = true;
          results[i].error = err;
        })
        .then(() => {
          if (++finish >= funcs.length) return resolve(results);
          run();
        });
    }
  });
};
