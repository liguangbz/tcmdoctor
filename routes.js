// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:
var uuid = require('uuid');
var gravatar = require('gravatar');

var mongodb = require('mongodb')
  , mongoose = require('mongoose');

var dbUrl = "localhost"
  , dbName = "test";

mongoose.connect(dbUrl, dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

exports.mongoose = mongoose;
var scha = mongoose.Schema({
	tang: {type: String , required: true, unique: true},
	fang: {type: String , required: true, unique: true},
});
var ports = mongoose.model('ports', scha);
//ports.findOne({tang:"桂枝汤"}, function(err, data) {
//	console.log(data.fang);
//		});
// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app,io){

	app.get('/', function(req, res){

		// Render views/home.html
		//res.render('home');
		var id = uuid.v4();
		res.redirect('/chat/'+id);
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){

		// Render the chant.html view
		res.render('chat');
	});

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

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
			socket.join(roomid);
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
			ports.findOne({tang: data.msg}, function(err, content) {
				if (content) {
			        socket.emit('receive', {msg:content.fang, user: "岐伯", img: data.img});
				} else {
			        socket.emit('receive', {msg:data.msg, user: "岐伯", img: data.img});
				}
			});
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


