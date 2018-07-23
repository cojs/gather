'use strict';

const assert = require('assert');

module.exports = function (funcs, n) {
  assert(Array.isArray(funcs), 'funcs must be array');
  n = n || 5;

  return new Promise(resolve => {
    const results = [];
    let index = 0;
    let finish = 0;
    for (let i = 0; i < n; i++) {
      run();
    }

    function run() {
      const i = index++;
      console.log(i);
      let ins = funcs[i];
      if (!ins) return;

      if (typeof ins === 'function') ins = ins();
      if (ins && typeof ins.next === 'function' && typeof ins.throw === 'function') ins = require('co')(ins);

      ins.then(res => {
          results[i] = { value: res };
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
