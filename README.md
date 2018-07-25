co-gather
=========

Execute thunks, generators, async functions in parallel with concurrency support and gather all the results.

`co-gather` is similar with [co-parallel](https://github.com/visionmedia/co-parallel), but `co-gather` will gather all the result of these thunks, even those thunks throw error.

## Installation

```
$ npm install co-gather
```

## Example

```js
var gather = require('co-gather');
const sleep = require('mz-modules/sleep');

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

(async () => {
  const start = Date.now();
  const res = await gather([
    gfun(1),
    gfun(null, 'error),
    async () => afun(null, 'error'),
    () => afun(4),
  ], 2);
  const use = Date.now() - start;
  around(use, 200);
})()
```

=>

```
[
  { isError: false, value: 1 },
  { isError: true, error: [Error: error] },
  { isError: true, error: [Error: error] },
  { isError: false, value: 4 }
]
```

## API


## gather(items, [concurrency])

Execute `items` in parallel, with the given concurrency defaulting to 5, and gather the result

## License

MIT
