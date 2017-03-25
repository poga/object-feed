var tape = require('tape')
var JSONFeed = require('.')
var tmp = require('tmp')

tape('set', function (t) {
  var j = new JSONFeed({path: tmp.dirSync().name})
  j.open(function () {
    t.ok(j.key)
    j.set({foo: 'bar'}, function (err, newJSON) {
      t.error(err)
      t.same(newJSON, {foo: 'bar'})
      t.end()
    })
  })
})

tape('update event', function (t) {
  var j = new JSONFeed({path: tmp.dirSync().name})
  j.open(function () {
    j.set({foo: 'bar'}, function (err, newJSON) {
      t.error(err)
      t.same(newJSON, {foo: 'bar'})
    })
  })

  j.on('update', function (newJSON) {
    t.same(newJSON, {foo: 'bar'})
    t.end()
  })
})

tape('update event * 2', function (t) {
  var j = new JSONFeed({path: tmp.dirSync().name})
  j.open(function () {
    j.set({foo: 'bar'}, function (err, newJSON) {
      t.error(err)
      t.same(newJSON, {foo: 'bar'})
      j.set({foo: 'bar', x: [1]}, function (err, newJSON) {
        t.error(err)
        t.same(newJSON, {foo: 'bar', x: [1]})
      })
    })
  })

  var i = 0
  j.on('update', function (newJSON) {
    if (i === 0) {
      t.same(newJSON, {foo: 'bar'})
      i++
    } else if (i === 1) {
      t.same(newJSON, {foo: 'bar', x: [1]})
      t.end()
    }
  })
})

tape('replicate', function (t) {
  var j = new JSONFeed({path: tmp.dirSync().name})
  var clone
  j.open(function () {
    clone = new JSONFeed(j.feed.key, {path: tmp.dirSync().name})
    clone.open(test)
  })

  function test () {
    replicate(clone.feed, j.feed, {live: true})
    clone.on('update', function (newJSON) {
      t.same(newJSON, {foo: 'bar'})
      t.end()
    })
    j.set({foo: 'bar'}, function (err, newJSON) {
      t.error(err)
      t.same(newJSON, {foo: 'bar'})
    })
  }
})

function replicate (a, b, opts) {
  var stream = a.replicate(opts)
  return stream.pipe(b.replicate(opts)).pipe(stream)
}
