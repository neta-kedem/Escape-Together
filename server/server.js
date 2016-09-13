"use strict";
const JSON_URL = './data.json';
const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
GameState = require('./gameState'),
fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const gameIo = io.of('/game');

function emitState(msg) {
	if(msg.hasOwnProperty('message')){
		gameIo.emit('message', msg);
		}
	else{
		gameIo.emit('state update', msg);
		}
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
	var hotspots = {};
	var modals = {};
	for (let scene in sourceJSON.scenes) {
	    if (sourceJSON.scenes[scene].type  === 'staticScene'){
	        modals[scene] = objectWithoutProperties(sourceJSON.scenes[scene],['type','hotSpots']);
        }
		hotspots[scene] = sourceJSON.scenes[scene].hotSpots.reduce((result,hs)=>{
			if (hs.hasOwnProperty('id')){
				result.push(objectWithoutProperties(hs,['pitch','yaw']));
			}
			return result;
		},[]);
	}
	return {hotSpots:hotspots, modals:modals};
}

let objStr = fs.readFileSync(JSON_URL, 'utf8');
//use eval to allow comments inside JSON file.
//eval fails on JSON files starting with "{", using () is a workaround for that
let clientsideJSON = eval('(' + objStr + ')');

let initialGameState = getGameStateFromJSON(clientsideJSON);
let inactiveUsers=[];
var gameState = new GameState(initialGameState, emitState);
gameIo.on('connection', function (socket) {
	var wantedUserId = +socket.handshake.query.userId;
	console.log('a user connected');
	let stateWithUserId;
	if (inactiveUsers[wantedUserId]){
		console.log("it's a known inactive user!");
		inactiveUsers[wantedUserId] = false;
		stateWithUserId = gameState.reconnectPlayer(wantedUserId);
	}else{
		stateWithUserId = gameState.addPlayer('gramsci', 'queer', 'classroom');
	}
	const userId = stateWithUserId.userId;
	console.log(stateWithUserId);
	socket.emit('state update', stateWithUserId);
	socket.broadcast.emit('state update', {
		bags : stateWithUserId.bags,
		players : stateWithUserId.players,
		scenes : stateWithUserId.scenes
	});
	socket.on('disconnect', function () {
		console.log('user',userId,'disconnected');
		inactiveUsers[userId] = true;
	});
	socket.on('chat message', function (msg) {
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

http.listen(3003, function () {
console.log('WebSocket is Ready');
});

