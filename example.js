var Converter = require('./');

var converter = new Converter();

converter.connect();

converter.on('created', function (change) {
    var that = this;
    var query = this.config.queries.insert;
    this.database.get(change.id, function (err, res) {
        if (err) throw err;
        var doc = { id : res._id, title : res.title };
        that.mysql.query(query, doc, function (err) {
            // prevents dups error.
        });
    });
});

converter.on('deleted', function (change) {
    var query = this.config.queries.delete;
    this.mysql.query(query, change.id); 
});
