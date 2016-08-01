// Minimal Simple REST API Handler (With MongoDB and Socket.io)
// Author: Yaron Biton misterBIT.co.il

"use strict";
const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
GameState = require('./gameState');
//		mongodb = require('mongodb')

//const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })

const app = express();
app.use(cors());
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const gameIo = io.of('/game');

/*
function dbConnect() {

return new Promise((resolve, reject) => {
// Connection URL
var url = 'mongodb://localhost:27017/seed';
// Use connect method to connect to the Server
mongodb.MongoClient.connect(url, function (err, db) {
if (err) {
cl('Cannot connect to DB', err)
reject(err);
}
else {
//cl("Connected to DB");
resolve(db);
}
});
});
}
 */
// var corsOptions = {
//   origins: 'http://localhost:8080',
//   credentials: false
// };
function emitState(state) {
	// console.log('emmitting: ', JSON.stringify(state));
	gameIo.emit('state update', state);
}

var gameState = new GameState({classroom:[{
					id : 'pikachu',
					shown : true,
					src : 'img/artifacts/Pikachu_64px.png',
					beingUsedBy : -1,
					required : [], //requires any one of the artifact from this list to activate (can be empty and then a click is enough)
					actions : [{"collect":"pikachu"},{"hideHotSpot":"pikachu"}]
					//other possible action: 
					//{"collect":"pikachu"} //collect an artifact. can be the same artifact back or anything else
					//{"loadScene":"library"}
					//{"showHotSpot":"raichu"}
					//{"hideHotSpot":"pikachu"} //when you collect an artifact usualy that's what you want
					//{"changeScene":"bma-1"}
				},{
					id : 'door',
					shown : true,
					src : 'img/artifacts/semi-trans.png',
					beingUsedBy : -1,
					required : ["pikachu"],
					actions : [{"showHotSpot":"raichu"},{"objectMessage":"you can open me with pikachu"}]
				},{
					id : 'raichu',
					shown : false,
					src : 'img/artifacts/Raichu.png',
					beingUsedBy : -1,
					required : [],
					actions : [{"collect":"raichu"},{"hideHotSpot":"raichu"}]
				},{
					id : 'small-window',
					shown : true,
					//src : 'img/artifacts/Raichu.png',
					beingUsedBy : -1,
					required : [],
					actions : [{"changeScene":"bma-1"}]
				}
			],
			'bma-1':[{
				id : 'doorBack',
				shown : true,
				//src : 'img/artifacts/Raichu.png',
				beingUsedBy : -1,
				required : [],
				actions : [{"changeScene":"classroom"}]
			}]}, emitState);
gameIo.on('connection', function (socket) {
	console.log('a user connected');

	const stateWithUserId = gameState.addPlayer('gramsci', 'queer', 'classroom');
		const userId = stateWithUserId.userId;
	console.log(stateWithUserId);
	socket.emit('login', stateWithUserId);
	socket.broadcast.emit('state update', {
		bags : stateWithUserId.bags,
		players : stateWithUserId.players,
		scenes : stateWithUserId.scenes
	});
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
	socket.on('chat message', function (msg) {
		// console.log('message: ' + msg);
		gameIo.emit('chat message', msg);
	});
	socket.on('userClick', function (msg) {
		console.log('userClick:', (msg));
		gameState.userClick(userId, msg);
	});
	socket.on('bagedArtifactClicked', function (msg) {
		console.log('bagedArtifactClicked:', msg);
		gameState.bagedArtifactClicked(userId, msg);
	});

});

console.log('WebSocket is Ready');
// Kickup our server
const baseUrl = 'http://192.168.1.5:3003/data';
// Note: app.listen will not work with cors and the socket
// app.listen(3003, function () {
http.listen(3003, function () {
	/*	console.log(`misterREST server is ready at ${baseUrl}`);
	console.log(`GET (list): \t\t ${baseUrl}/{entity}`);
	console.log(`GET (single): \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`DELETE: \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`PUT (update): \t\t ${baseUrl}/{entity}/{id}`);
	console.log(`POST (add): \t\t ${baseUrl}/{entity}`);
	 */
});
/*
// Some small time utility functions
function cl(...params) {
console.log.apply(console, params);
}
*/
