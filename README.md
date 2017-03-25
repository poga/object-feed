# object-feed

A distributed live-updating JavaScript object.

`npm i object-feed`

## Synopsis

In one process:

```javascript
var ObjectFeed = require('object-feed')

var obj = new ObjectFeed('./feed')
obj.open(function () {
  obj.set({foo: 'bar'})
  console.log(obj.key.toString('hex'))
})
```

In another process:

```javascript
var obj = new ObjectFeed('./another-feed', '<KEY FROM ABOVE>')
obj.on('update', function (value) {
  console.log(value) // === {foo: 'bar'}
})
```

## License

MIT

