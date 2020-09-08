co-gather
=========

Execute thunks, generators, async functions in parallel with concurrency support and gather all the results.

`co-gather` is similar with [co-parallel](https://github.com/visionmedia/co-parallel), but `co-gather` will gather all the result of these thunks, even those thunks throw error.

## Installation

```
$ npm install co-gather
```

## Example

- generator function

```js
const gather = require('./');
const sleep = require('mz-modules/sleep');

function* fun(result, error, interval) {
  yield sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

console.time('gather');
gather([
  fun(1),
  fun(null, 'error'),
], 2).then(res => {
  console.timeEnd('gather');
  console.log(res);
});
```

- async function

```js
const gather = require('./');
const sleep = require('mz-modules/sleep');

async function fun(result, error, interval) {
  await sleep(interval || 100);
  if (error) throw new Error(error);
  return result;
}

console.time('gather');
gather([
  () => fun(1),
  async () => fun(null, 'error'),
], 2).then(res => {
  console.timeEnd('gather');
  console.log(res);
});
```
=>

```
[
  { isError: false, value: 1 },
  { isError: true, error: [Error: error] }
]
```

## API


## gather(items, [concurrency])

Execute `items` in parallel, with the given concurrency defaulting to 5, and gather the result

## License

MIT
