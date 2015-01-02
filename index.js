var follow = require('follow');
var nano = require('nano');
var mysql = require('mysql');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var CONFIG = require('./config.json');

function Converter (config) {
    if (!(this instanceof Converter)) return new Converter(config);
    this.config = config || CONFIG;
    this.couch = this.parseCouchDB();
    this.mysql = this.parseMySQL();
    this.database = require('nano')(this.couch);
}

util.inherits(Converter, EventEmitter);

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
    var self = this;
    this.mysql.connect(function (err) {
        if (err) throw err;
        self.listen();
    });
};

Converter.prototype.listen = function () {
    var self = this;
    follow(this.couch, function (err, change) {
        if (err) throw err;
        self.handle(change);
    });
};

Converter.prototype.handle = function (change) {
    if (change.deleted) {
        this.sync(change, 'deleted');
    } else if (change.changes[0].rev[0] != '1') {
        this.sync(change, 'updated');
    } else {
        this.sync(change, 'created');
    } 
};

Converter.prototype.sync = function (change, status) {
    this.emit(status, change);
};

module.exports = Converter;
