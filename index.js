var follow = require('follow');
var nano = require('nano');
var mysql = require('mysql');

var CONFIG = {
    couchHost : '127.0.0.1',
    couchPort : '5984',
    couchDatabase : 'offline',
    mySQLHost : '127.0.0.1',
    mySQLPort : '',
    mySQLUser : 'root',
    mySQLPassword : 'password',
    mySQLDatabase : 'offline'
}

function Converter (config) {
    this.config = config || CONFIG;
    this.couch = this.parseCouchDB();
    this.mysql = this.parseMySQL();
    this.database = require('nano')(this.couch);
}

Converter.prototype.parseCouchDB = function () {
    return 'http://' 
        + this.config.couchHost + ':' 
        + this.config.couchPort + '/' 
        + this.config.couchDatabase;
};

Converter.prototype.parseMySQL = function () {
    return mysql.createConnection({
        host : this.config.mySQLHost,
        user : this.config.mySQLUser,
        password : this.config.mySQLPassword,
        database : this.config.mySQLDatabase
    });
};

Converter.prototype.connect = function () {
    var that = this;
    this.mysql.connect(function (err) {
        if (err) throw err;
        that.listen();
    });
};

Converter.prototype.listen = function () {
    var that = this;
    follow(this.couch, function (err, change) {
        if (err) throw err;
        that.handle(change);
    });
};

Converter.prototype.handle = function (change) {
    if (change.deleted) {
        // TODO : remove
    } else if (change.changes[0].rev[0] != '1') {
        // TODO : change
    } else {
        this.sync(change, 'created');
    } 
};

Converter.prototype.sync = function (change, status) {
    var that = this;
    this.database.get(change.id, function (err, res) {
        if (status === 'created') {
            that.createDoc({ id : res._id, title : res.title });            
        }
    });
};

Converter.prototype.createDoc = function (doc) {
    var query = 'insert into post set ?';
    this.mysql.query(query, doc,  function (err, res) {
        if (err) throw err;
        console.log(res);
    });
};

module.exports = Converter;