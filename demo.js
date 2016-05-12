var convnetjs = require("convnetjs");
var fs = require("fs");
var layer_defs = [];
var net = new convnetjs.Net();

// input layer declares size of input. here: 2-D data
// ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
// then the first two dimensions (sx, sy) will always be kept at size 1
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
// declare 20 neurons, followed by ReLU (rectified linear unit non-linearity)
layer_defs.push({type:'fc', num_neurons:20, activation:'relu'}); 
// declare the linear classifier on top of the previous hidden layer
layer_defs.push({type:'softmax', num_classes:6});


var data, labels, N;

function random_data(){
  data = [];
  labels = [];
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(-60,-50), convnetjs.randf(-60,-50)]); labels.push(-3);
  }
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(-40,-30), convnetjs.randf(-40,-30)]); labels.push(-2);
  }
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(-20,-10), convnetjs.randf(-20,-10)]); labels.push(-1);
  }
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(10,20), convnetjs.randf(10,20)]); labels.push(1);
  }
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(30,40), convnetjs.randf(30,40)]); labels.push(2);
  }
  for(var k=0;k<40;k++) {
    data.push([convnetjs.randf(50,60), convnetjs.randf(50,60)]); labels.push(3);
  }
  N = labels.length;
}

var should_train = false;
var trainer;

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

if (should_train) {
    net.makeLayers(layer_defs);
    trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:10, l2_decay:0.001});
    random_data();
    var x = new convnetjs.Vol(1,1,2);
    var avloss = 0.0;
    for(var iters=0;iters<20;iters++) {
        for(var ix=0;ix<N;ix++) {
            x.w = data[ix];
    //        console.log("%s %s", x.w,labels[ix]);
            var stats = trainer.train(x, labels[ix]);
            avloss += stats.loss;
        }
    }
    avloss /= N*iters;
    
    fs.writeFile('json.txt', JSON.stringify(net.toJSON()));
}



//net.toJSON();

// forward a random data point through the network
var mx = new convnetjs.Vol([11, 19]);
var prob = net.forward(mx); 

// prob is a Vol. Vols have a field .w that stores the raw data, and .dw that stores gradients
console.log('probability that x is class 0: ' + prob.w[0], prob.w[1], prob.w[2], prob.w[3], prob.w[4], prob.w[5]); // prints 0.50101
console.log(net.getPrediction());
//var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, l2_decay:0.001});
//trainer.train(x, 1); // train the network, specifying that x is class zero

//var prob2 = net.forward(x);
//console.log('probability that x is class 0: ' + prob2.w[0], prob2.w[2], prob2.w[2]);

