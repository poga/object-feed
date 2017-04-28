# object-feed

A distributed live-updating JavaScript object.

`npm i object-feed`

## Synopsis

In one process:

```javascript
var Feed = require('object-feed')
var swarm = require('hyperdiscovery')

var feed = new Feed('./feed')
swarm(feed.feed)
feed.open(function () {
  feed.set({foo: 'bar'})
  console.log(feed.key.toString('hex'))
})
```

In another process:

```javascript
var feed = new Feed('./another-feed', '<KEY FROM ABOVE>')
var swarm = require('hyperdiscovery')

swarm(feed.feed)
feed.on('update', function (value) {
  console.log(value) // === {foo: 'bar'}
})
```

## License

MIT

