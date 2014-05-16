co-gather
=========

Execute thunks in parallel with concurrency support and gather all the results.

`co-gather` is similar with [co-parallel](https://github.com/visionmedia/co-parallel), but `co-gather` will gather all the result of these thunks, even those thunks throw error.

## Installation

```
$ npm install co-gather
```

## Example

```js
var gather = require('co-gather');
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
```

=>

```
[
  { isError: false, value: 0 },
  { isError: true, error: [Error: error] },
  { isError: true, error: [Error: error] },
  { isError: true, error: [Error: error] },
  { isError: false, value: 4 }
]
```

## API


## gather(thunks, [concurrency])

Execute `thunks` in parallel, with the given concurrency defaulting to 5, and gather the result

## License

MIT
