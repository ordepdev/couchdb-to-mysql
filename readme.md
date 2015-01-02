#### converter
> tiny tool to sync data between CouchDB and MySQL

##### why? 
well, i presented CouchDB to a person and the first question was... "can you sync with MySQL?"

> "Can PouchDB sync with MongoDB/MySQL/my current non-CouchDB database? No." - CouchDB FAQ.

Whith this tool... Yes.

##### how?
converter listen for CouchDB changes and reflects them on MySQL.

##### example

```js
var converter = require('couchdb-to-mysql');
var cvr = converter();
cvr.connect();
cvr.on('created', function (change) {
    // replicate changes on mysql    
});
```

##### methods

```js
var converter = require('couchdb-to-mysql')
```

###### var cvr = converter(config={})

Optionaly pass in a `config`:
* `config.couch.host`
* `config.couch.port`
* `config.couch.database`
* `config.mySQL.host`
* `config.mySQL.port`
* `config.mySQL.user`
* `config.mySQL.password`
* `config.mySQL.database`

##### events

###### cvr.on('created', function (change) {})
Every time a document is created, a `created` event fires.

###### cvr.on('updated', function (change) {})
Every time a document is updated, a `updated` event fires.

###### cvr.on('deleted', function (change) {})
Every time a document is deleted, a `deleted` event fires.
