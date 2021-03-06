var convnetjs = require("./convnet.js");
var fs = require("fs");
var layer_defs = [];
var net = new convnetjs.Net();
var stream = require("querystream");

var dbUrl = "localhost"
  , dbName = "tcm";
var VOLH = 48, VOLW = 32;

var data, labels, N;

var jfdb = require("./jfdb.js");

layer_defs.push({type:'input', out_sx:VOLW, out_sy:VOLH, out_depth:1});
layer_defs.push({type:'fc', num_neurons:200, activation:'relu'}); 
//layer_defs.push({type:'conv', sx:5, filters:8, stride:1, pad:2, activation:'relu'});
//layer_defs.push({type:'pool', sx:2, stride:2});
//layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
//layer_defs.push({type:'pool', sx:3, stride:3});
layer_defs.push({type:'softmax', num_classes:127});

function query_labels(fpool)
{
	var jf = jfdb.jingfang;
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
    var student = jfdb.trainer;
	student.find({}, function(err, recs) {
    	if (!err) {
    		recs.forEach(function(mp) {
					fpool.forEach(function(fp) {
							//console.log(fp.tang);
							if (fp.tang === mp.fang_l) {
							    data.push(mp.zheng);
								labels.push(parseInt(fp.order));
							}
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

//var should_train = false;
var should_train = false;
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
        for(var iters=0;iters<20;iters++) {
			for(var ix=0;ix<N;ix++) {
                x.w = data[ix];
				//console.log(labels[ix]);
				if (typeof(x.w) === 'undefined')
					continue;
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

