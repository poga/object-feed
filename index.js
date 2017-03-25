var hypercore = require('hypercore')
var events = require('events')
var inherits = require('inherits')
var jsonpatch = require('fast-json-patch')

function ObjectFeed (path, key) {
  events.EventEmitter.call(this)
  this.feed = hypercore(path, key)
  this.json = {}
}

inherits(ObjectFeed, events.EventEmitter)

ObjectFeed.prototype.open = function (cb) {
  var self = this
  this.feed.ready(function () {
    self.feed.on('error', function (err) {
      self.emit('error', err)
    })
    self.key = self.feed.key

    read()
  })

  function read () {
    var rs = self.feed.createReadStream({live: true})
    var i = 0
    rs.on('data', function (patch) {
      jsonpatch.apply(self.json, JSON.parse(patch))
      i++

      if (i === self.feed.length) {
        self.emit('update', self.json)
      }
    })
    cb()
  }
}

ObjectFeed.prototype.set = function (obj, cb) {
  var diff = jsonpatch.compare(this.json, obj)
  var self = this
  this.feed.append(JSON.stringify(diff), function (err) {
    if (err) return cb(err)

    self.once('update', function (newJSON) {
      cb(null, newJSON)
    })
  })
}

module.exports = ObjectFeed
