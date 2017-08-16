var mongodb = require('mongodb')
  , mongoose = require('mongoose');

var dbUrl = "localhost"
  , dbName = "tcm";

mongoose.connect(dbUrl, dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

var scha = mongoose.Schema({
	order: {type: String , required: true, unique: true},
	tang: {type: String , required: true, unique: true},
	fang: {type: String , required: true, unique: true},
});

var jingfang = mongoose.model('jingfang', scha);

var schm = mongoose.Schema({
	jing_l: {type: String},
	fang_l: {type: String},
	zheng: {type: Array}
});

var trainer = mongoose.model('learning', schm);

exports.jingfang = jingfang;
exports.trainer = trainer;