var mongodb = require('mongodb')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user={  name:{type:String},password:{type:String}};
try {
	global.db = mongoose.createConnection("mongodb://localhost:27017/tcmuser");
} catch (e) {}
mongoose.model('user',new Schema(user))
module.exports = { 
    getModel: function(type){
        return mongoose.model(type);
    }
};
var _getModel = function(type){ 
    return mongoose.model(type);
};
