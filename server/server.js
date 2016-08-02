// Minimal Simple REST API Handler (With MongoDB and Socket.io)
// Author: Yaron Biton misterBIT.co.il

"use strict";
const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
GameState = require('./gameState'),
fs = require('fs');
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


//from babel
function objectWithoutProperties(obj, keys) {
	var target = {};
	for (var i in obj) {
		if (keys.indexOf(i) >= 0)
			continue;
		if (!Object.prototype.hasOwnProperty.call(obj, i))
			continue;
		target[i] = obj[i];
	}
	return target;
}

function getGameStateFromJSON(sourceJSON) {
	var sourceJSON = sourceJSON;
	var res = {};
	for (let scene in sourceJSON.scenes) {
		res[scene] = sourceJSON.scenes[scene].hotSpots.reduce((result,hs)=>{
			if (hs.hasOwnProperty('id')){
				result.push(objectWithoutProperties(hs,['pitch','yaw']));
			}
			return result;
		},[]);
	}
	return res;
}

let objStr = fs.readFileSync('./json/data.json', 'utf8');
//use eval to allow comments inside JSON file.
//eval fails on JSON files starting with "{", using () is a workaround for that
let clientsideJSON = eval('(' + objStr + ')');

let initialGameState = getGameStateFromJSON(clientsideJSON);

var gameState = new GameState(initialGameState, emitState);
gameIo.on('connection', function (socket) {
	console.log('a user connected');

	const stateWithUserId = gameState.addPlayer('gramsci', 'queer', 'classroom');
	const userId = stateWithUserId.userId;
	console.log(stateWithUserId);
	socket.emit('state update', stateWithUserId);
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
const baseUrl = 'http://192.168.1.5/data';
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

