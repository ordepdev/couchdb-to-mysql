var converter = require('./');
var cvr = converter();

cvr.connect();

cvr.on('created', function (change) {
    var self = this;
    var query = this.config.queries.insert;
    this.database.get(change.id, function (err, res) {
        if (err) throw err;
        var doc = { id : res._id, title : res.title };
        self.mysql.query(query, doc, function (err) {
            // prevents dups error.
        });
    });
});

cvr.on('deleted', function (change) {
    var query = this.config.queries.delete;
    this.mysql.query(query, change.id); 
});
