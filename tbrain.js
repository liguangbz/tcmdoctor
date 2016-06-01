var convnetjs = require("./convnet.js");
var fs = require("fs");
var layer_defs = [];
var net = new convnetjs.Net();
var stream = require("querystream");
var mongodb = require('mongodb')
  , mongoose = require('mongoose');

var dbUrl = "localhost"
  , dbName = "tcm";
var VOLH = 48, VOLW = 32;

var data, labels, N;

mongoose.connect(dbUrl, dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

exports.mongoose = mongoose;

var schm = mongoose.Schema({
    jing_l: {type: String},
    fang_l: {type: String},
    zheng: {type: Array}
});
var scha = mongoose.Schema({
    order: {type: String},
    tang: {type: String},
    fang: {type: Array}
});

layer_defs.push({type:'input', out_sx:VOLW, out_sy:VOLH, out_depth:1});
layer_defs.push({type:'fc', num_neurons:200, activation:'relu'}); 
//layer_defs.push({type:'conv', sx:5, filters:8, stride:1, pad:2, activation:'relu'});
//layer_defs.push({type:'pool', sx:2, stride:2});
//layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
//layer_defs.push({type:'pool', sx:3, stride:3});
layer_defs.push({type:'softmax', num_classes:123});

function query_labels(fpool)
{
	var jf = mongoose.model('jingfang', scha);
	jf.find({}, function(err, recs) {
			recs.forEach(function(data) {
					fpool.push(data);
			});
	});
}

			test3();
var result;
function init_net() {
	data = [];
	labels = [];
    var fpool = [];
    query_labels(fpool);
    var student = mongoose.model('learning', schm);
	student.find({}, function(err, recs) {
    	if (!err) {
    		recs.forEach(function(mp) {
					data.push(mp.zheng);
					fpool.forEach(function(fp) {
							//console.log(fp.tang);
							if (fp.tang === mp.fang_l)
							     labels.push(parseInt(fp.order));
					});
            });
			N = labels.length;
			test2();
			//test();
			result = tellme_whichf(testdata);
			process.send(result);
    	}
    });
}
var testdata;
process.on('message', function(m) {
		testdata = m;
		init_net();
});
function tellme_whichf(data)
{
     var mx = new convnetjs.Vol();
	 mx.w = data;
	 var prob = net.forward(mx);
	  
	 return net.getPrediction();

}

var should_train = false;
//var should_train = true;
var trainer;

function test3() {
    if (fs.existsSync('json.txt')) {
    	var data = fs.readFileSync('json.txt');
    		if (data === null) {
    		    should_train = true;
    		} else { 
       		    net.fromJSON(JSON.parse(data));
                trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:10, l2_decay:0.001});
    		}
        //fs.writeFile('json1.txt', JSON.stringify(net.toJSON()));
    }
}

rdata = [];
function test2() {
    if (should_train) {
        net.makeLayers(layer_defs);
        trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:16, l2_decay:0.001});
        var x = new convnetjs.Vol(VOLW,VOLH,1, 0.0);
        var avloss = 0.0;
			console.log("labels:"+labels);
        for(var iters=0;iters<30;iters++) {
            for(var ix=0;ix<N;ix++) {
			    //var mmp = data[ix].toString();
				//var mmo = qdata.toString();
                x.w = data[ix];
				//console.log(data.length);
				//console.log(labels.length);
				//console.log(x.w);
                var stats = trainer.train(x, labels[ix]);
                avloss += stats.loss;
            }
        }
    //    avloss /= N*iters;
        
        fs.writeFile('json.txt', JSON.stringify(net.toJSON()));
    }
}


//net.toJSON();
function test() {
    // forward a random data point through the network
    var mx = new convnetjs.Vol();
    mx.w = rdata;
    var prob = net.forward(mx); 
    
    // prob is a Vol. Vols have a field .w that stores the raw data, and .dw that stores gradients
    //console.log('probability that x is class 0: ' + prob.w[0], prob.w[1], prob.w[2], prob.w[3], prob.w[4], prob.w[5]); // prints 0.50101
    console.log(net.getPrediction());
}

