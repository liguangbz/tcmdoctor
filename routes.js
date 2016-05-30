// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

var childProcess = require('child_process');
var n = childProcess.fork('./tbrain.js');

var uuid = require('uuid');
var gravatar = require('gravatar');
var symp = require("./symp.js");
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

exports.mongoose = mongoose;

var scha = mongoose.Schema({
	order: {type: String , required: true, unique: true},
	tang: {type: String , required: true, unique: true},
	fang: {type: String , required: true, unique: true},
});
var ports = mongoose.model('jingfang', scha);

var schm = mongoose.Schema({
	jing_l: {type: String},
	fang_l: {type: String},
	zheng: {type: Array}
});
var trainer = mongoose.model('learning', schm);
//ports.findOne({tang:"桂枝汤"}, function(err, data) {
//	console.log(data.fang);
//		});
// Export a function, so that we can pass 
// the app and io instances from the app.js file:
var idmap = [];
var ids = 0;
var mc= 0;
var premsg = "";
var chatobj = "asksymp";
var tmpfang = "";
var tsock;

n.on('message', function(m) {
		ports.findOne({order:m}, function(err, wf) {
			var mahuang = RegExp("麻黄");
			var fang = wf.fang;
			if (fang.match(mahuang))
			    fang = fang+"【请确认你的身体足够强壮，否则勿服此药】";
			if (!err)
                console.log(wf.fang);
				tsock.emit('receive', {msg:fang, user: "岐伯", img: ""});
		});

});

module.exports = function(app,io){

	app.get('/', function(req, res){

		// Render views/home.html
		//res.render('home');
		//var id = uuid.v4();
		var id = ids++;
		res.redirect('/chat/'+id);
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/fill', function(req, res) {
		res.render('fill');
	});

	app.get('/chat/:id', function(req,res){

		// Render the chant.html view
		res.render('chat');
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {
			tsock = socket;

		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room
        socket.on('fill', function(data) {
			//console.log(data.msg);
			console.log(data.jing);
			console.log(data.fang);
            //var mt = new trainer({jing_l:data.jing, fang_l:data.fang, zheng:data.msg});
			var obj = {jing_l:data.jing, fang_l:data.fang, zheng:data.msg};
            var mt = new trainer(obj);//{jing_l:data.jing, fang_l:data.fang, zheng:data.msg});
			//mt.jing_l = data.jing;
			//mt.fang_l = data.fang;
			//mt.zheng = data.msg.toString();
			//var lq = data.msg.slice();
			//console.log(mt.zheng);
			//mt.markModified('zheng');
			mt.save(function(err){});
			//trainer.create({jing_l:data.jing, fang_l:data.fang, zheng:"3456"});
			//trainer.update({jing_l:data.jing, fang_l:data.fang, zheng:data.msg});
		});
		socket.on('load',function(data){

			var room = findClientsSocket(io,data);
			if(room.length === 0 ) {

				socket.emit('peopleinchat', {number: 0});
			}
			else if(room.length === 1) {

				socket.emit('peopleinchat', {
					number: 1,
					user: room[0].username,
					avatar: room[0].avatar,
					id: data
				});
			}
			else if(room.length >= 2) {

				chat.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {

				// their own unique socket object
			var roomid = data;
			socket.username = "liguang";
			socket.room = roomid;
//				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

			// Add the client to the room
//			socket.join(roomid);
			socket.username = "qh";
			socket.room = roomid;

	//		socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});
			socket.join(roomid);

			var usernames = [],
			avatars = [];

			usernames.push("岐伯");
			usernames.push("小轩");

			// Send the startChat event to all the people in the
			// room, along with a list of people that are in it.

			chat.in(roomid).emit('startChat', {
				boolean: true,
				id: roomid,
				users: usernames,
				avatars: avatars
			});
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left
            console.log("bye: "+this.room);
			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data) {
			var msg = RegExp('^'+data.msg);
			var hrec = false;
			var tchinese = RegExp("[\u4e00-\u9fa5]+");
			var getchatfang = RegExp("[\u4e00-\u9fa5]{0,}[查找翻问][\u4e00-\u9fa5]{0,}方[\u4e00-\u9fa5]{0,}");
			var trygetfang = RegExp("[\u4e00-\u9fa5]{0,}[汤丸散膏丹剂]");
			var getchatsymp = RegExp("[\u4e00-\u9fa5]{0,}[病痛疼累肿][\u4e00-\u9fa5]{0,}");
			var getyes = RegExp("是|是的|对|当然|当然了|Yes|yes|Y|y");
			var togroup = RegExp("[,\uff0c ]|和|还有");
			var askend = RegExp("没|没有");
			var stack_msg = data.msg.split(togroup);
			var sweetmsg = ["好的，说吧","可以呀，说吧","没问题，说吧"];

			if (chatobj === "askyes") {
			    if (data.msg.match(getyes)) {
				    msg = RegExp('^'+premsg);
				    chatobj = "askfang";
				} else 
				    chatobj = "asksymp";
			}
			if (data.msg.match(trygetfang) && chatobj !== "askyes" && chatobj !== "askfang") {
			   socket.emit('receive', {msg:"你想查询方剂？", user: "岐伯", img: data.img});
			   chatobj = "askyes";
			   premsg = data.msg;
			}
			if (data.msg.match(getchatfang)) {
			    chatobj = "askfang";
    			socket.emit('receive', {msg:sweetmsg[Math.round(Math.random() * 10) % sweetmsg.length], user: "岐伯", img: data.img});
			}
			if (data.msg.match(getchatsymp))
			    chatobj = "asksymp";
			if (chatobj === "asksymp") {
				if (data.msg.match(askend)) {
				} else
    			if (stack_msg.length > 1) {
					symp.giveme(stack_msg);
					if (symp.state !== "" && symp.state !== "")
						socket.emit('receive', {msg:symp.hintmsg, user: "岐伯", img: data.img});
    			} else {
    			        if (symp.state !== "")
    					    symp.giveme(data.msg+premsg);
    					else
    			            symp.giveme(data.msg);
    					console.log(symp.hintmsg);
    					if (symp.hintmsg !== "" && symp.state !== "") {
    					    premsg = data.msg;
    					    socket.emit('receive', {msg:symp.hintmsg, user: "岐伯", img: data.img});
    					}
    					symp.hintmsg = "";
    			}
				if (symp.answer !== "" && symp.state === "") {
					if (data.msg.match(askend)) {
					    n.send(symp.getarray());
					}
					//if (symp.doit === 0xaa) {
						//console.log(symp.getarray().join());

					 //   console.log("----------------"+symp.doit);
					//	symp.doit = 0;
					//}
					//socket.emit('receive', {msg:fang, user: "岐伯", img: data.img});
					else
					    socket.emit('receive', {msg:symp.answer, user: "岐伯", img: data.img});
				}
			}
			if (chatobj === "askfang") {
    			ports.find({tang: msg}, function(err, content) {
        			if (!err) {
        				content.forEach(function(qf) {
        					hrec = true;
            				if (qf) {
            			            socket.emit('receive', {msg:qf.fang, user: "岐伯", img: data.img});
            				} else {
            			            socket.emit('receive', {msg:data.msg, user: "岐伯", img: data.img});
            				}
    				    });
    					if (!hrec) {
    				        var qmsg = RegExp(data.msg);
        		            ports.find({tang: qmsg}, function(err, content) {
        			            if (!err) {
        				            content.forEach(function(qf) {
            				            if (qf) {
    									    hrec = false;
            			                    socket.emit('receive', {msg:qf.fang, user: "岐伯", img: data.img});
            				            } else {
            			                    socket.emit('receive', {msg:data.msg, user: "岐伯", img: data.img});
            				            }
    							    });
    					        }
    					    });
    				    }
    				} else console.log("nothing!");
                    if (!hrec)
                       socket.emit('receive', {msg:data.msg, user: "岐伯", img: data.img});
    			});
			}
			// When the server receives a message, it sends it to the other person in the room.
			//socket.emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});
	});
};

function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}


