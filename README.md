# json-feed

A distributed live-updating JSON.

`npm i json-feed`

## Synopsis

In one process:

```javascript
var JSONFeed = require('json-feed')

var obj = new JSONFeed('./feed')
obj.open(function () {
  obj.set({foo: 'bar'})
  console.log(obj.key.toString('hex'))
})
```

In another process:

```javascript
var obj = new JSONFeed('./another-feed', '<KEY FROM ABOVE>')
obj.on('update', function (value) {
  console.log(value) // === {foo: 'bar'}
})
```

## License

MIT

