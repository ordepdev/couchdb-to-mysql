var follow = require('follow');
var nano = require('nano');
var mysql = require('mysql');
var CONFIG = require('./config.json');

function Converter (config, queries) {
    this.config = config || CONFIG;
    this.couch = this.parseCouchDB();
    this.mysql = this.parseMySQL();
    this.database = require('nano')(this.couch);
}

Converter.prototype.parseCouchDB = function () {
    return 'http://' 
        + this.config.couch.host + ':' 
        + this.config.couch.port + '/' 
        + this.config.couch.database;
};

Converter.prototype.parseMySQL = function () {
    return mysql.createConnection({
        host : this.config.mySQL.host,
        user : this.config.mySQL.user,
        password : this.config.mySQL.password,
        database : this.config.mySQL.database
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
        // TODO : delete
    } else if (change.changes[0].rev[0] != '1') {
        // TODO : update
    } else {
        this.sync(change, 'created');
    } 
};

Converter.prototype.sync = function (change, status) {
    var that = this;
    this.database.get(change.id, function (err, res) {
        if (status === 'created') {
            that.insertDoc({ id : res._id, title : res.title });            
        }
    });
};

Converter.prototype.insertDoc = function (doc) {
    this.mysql.query(this.config.queries.insert, doc,  function (err, res) {
        if (err) throw err;
    });
};

Converter.prototype.updateDoc = function (doc) {
    // TODO : update
};

Converter.prototype.deleteDoc = function (doc) {
    // TODO : delete
};

module.exports = Converter;