# object-feed

A distributed live-updating JavaScript object.

`npm i object-feed`

## Synopsis

In one process:

```javascript
var Feed = require('object-feed')

var feed = new Feed('./feed')
feed.open(function () {
  feed.set({foo: 'bar'})
  console.log(feed.key.toString('hex'))
})
```

In another process:

```javascript
var feed = new Feed('./another-feed', '<KEY FROM ABOVE>')
feed.on('update', function (value) {
  console.log(value) // === {foo: 'bar'}
})
```

## License

MIT

