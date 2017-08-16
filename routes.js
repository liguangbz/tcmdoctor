var childProcess = require('child_process');
//var n = childProcess.fork('./tbrain.js');

var uuid = require('uuid');
var symp = require("./symp.js");

var jfdb = require("./jfdb.js");
var users = require("./userdb.js").getModel('user');

var brain = require('./brain.js');

var idmap = [];
var ids = 0;
var mc= 0;
var premsg = "";
var chatobj = "asksymp";
var tmpfang = "";
var tsock;

//n.on('message', function(m) {
function make_decision(m) {
    	var mahuang = RegExp("麻黄");
    	var yao = RegExp(",|:");
    	var fufang = (m[1] < 0.8 && m[3] > 0.2);
    	var fang = {a:"",b:""};
    	var mfang;
    	console.log("we got "+ m);
    	jfdb.jingfang.findOne({order:m[0]}, function(err, wf) {
    			if (wf === null)
    			    return;
    			//console.log(wf.fang);
    			fang.a = wf.fang;
    			//console.log(fang.a.split(yao));
    			if (!fufang) {
    			    if (fang.a.match(mahuang))
    		           fang.a = fang.a+"    【请确认你的身体足够强壮，否则勿服此药】";
    			       tsock.emit('receive', {msg:fang.a, user: "岐伯", img: ""});
    			}
    	});
    	if (fufang) {
    	    jfdb.jingfang.findOne({order:m[2]}, function(err, wf) {
    				var f3 = [0];
    				var f1 = fang.a.split(yao);
    				//console.log(wf.fang);
    				fang.b = wf.fang;
    				var f2 = wf.fang.split(yao);
    				for (var i = 0; i < f1.length; i = i+2) {
    				    for (var j = 0; j < f2.length; j = j+2) {
    				        if (f1[i] === f2[j]) {
    						    f2.splice(j, 2);
    							continue;
    						}
    					}
    				}
    				for (var k = 0; k < f2.length; k = k+2)
    				     f3[k/2] = f2[k]+":"+f2[k+1];
    				fang.b = f3.join(",");
    				//console.log(f3);
    				mfang = fang.a+","+fang.b;
    		        if (mfang.match(mahuang))
    		            mfang = mfang+"  【请确认你的身体足够强壮，否则勿服此药】";
    			    tsock.emit('receive', {msg:mfang, user: "岐伯", img: ""});

    	    });
    	}
}
//});

module.exports = function(app,io){

    app.get('/', function(req, res) {
    	try {
    		if (!req.session.user) {
    			req.session.error = "请先登录"
    		    res.redirect("/login");
    	    }
    	} catch (e) {
    		console.log(e);
    	}
        //res.redirect('/chat');
    	//res.redirect('/chat/'+id);
    });

    app.get('/login', function(req, res) {
    	console.log("get login");
        res.render('login');
    });

    app.post('/login', function(req, res) {
    	console.log("post login");
    	var name = req.body.name;
    	users.findOne({name:name}, function(err, user) {
    		if (err) {
    			console.log(err);
    		} else if (!user) {
    			req.session.error = '用户名不存在！';
    			res.send(500);
    			console.log("no such user");
    		} else if (req.body.password != user.password) {
    			req.session.error = '密码错误';
    			res.send(500);
    		} else {
    			req.session.user = user;
    			res.sendStatus(200);
    		}
    	});
    });

    app.get('/register', function(req, res) {
        res.render('register', {title: "register"});
    });

    app.post('/register', function(req, res) {
    	var name = req.body.name;
    	var password = req.body.password
    	users.findOne({name:name}, function(err, user) {
    		if (err) {
    			console.log(err);
    		} else if (user) {
    			console.log("same user found");
    			req.session.error = '用户名已存在！';
    			//res.render('register', {title: "register", message: '<div class="" style="color:red;">'+req.session.error+'</div>'});
    			res.sendStatus(500);
    		} else users.create({name:name, password:password}, function(err, text) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("add user correctly");
    				res.sendStatus(200);
    			}
    		});
    	});
    });

    app.get('/intro', function(req, res) {
        res.render('intro');
    });

    app.get('/fill', function(req, res) {
    	res.render('fill');
    });

    app.get('/chat', function(req, res) {
            if (req == undefined)
                return;
            if (!req.session.user)
            	res.redirect('/login')
            var deviceAgent = req.get("user-agent").toLowerCase();
            var agentID = deviceAgent.match(/(iphone|ipad|android)/);
            if (agentID) {
    	        res.render('pchat');
            } else {
    	        res.render('chat');
            }
    });

    // Initialize a new socket.io application, named 'chat'
    var chat = io.on('connection', function (socket) {
    	tsock = socket;
        socket.on('fill', function(data) {
    		//console.log(data.msg);
    		console.log(data.jing);
    		console.log(data.fang);
    		var trainer = jfdb.trainer;
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
    		var sizhi = RegExp("四肢");
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
    			if (data.msg.match(sizhi)) {
    				var msg = data.msg;
    				data.msg = data.msg.replace(sizhi,"手");
    				msg = msg.replace(sizhi,"腿");
    				data.msg = data.msg+" "+msg;
    				//console.log("sizhi:"+data.msg);
    			}
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
    					var idea = brain.get_idea(symp.getarray());
    					make_decision(idea);
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
