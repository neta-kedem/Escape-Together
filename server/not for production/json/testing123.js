'use strict'
var sourceJSON = {
	"default" : {
		"firstScene" : "classroom",
		// "author": "Escape",
		"autoLoad" : true,
		"hotSpotDebug" : true
	},

	"scenes" : {
		"classroom" : {
			"title" : "Escape Together",
			"hfov" : 100,
			"pitch" : 10,
			"yaw" : 50,
			"northOffset" : 289,
			"type" : "multires",
			"isRendered" : false,
			// "type": "cubemap",
			// "cubeMap":[
			// 	"/img/panoramas/classroom/fallback/f.jpg",
			// 	"/img/panoramas/classroom/fallback/b.jpg",
			// 	"/img/panoramas/classroom/fallback/u.jpg",
			// 	"/img/panoramas/classroom/fallback/d.jpg",
			// 	"/img/panoramas/classroom/fallback/l.jpg",
			// 	"/img/panoramas/classroom/fallback/r.jpg"
			// ],
			"multiRes" : {
				"path" : "/img/panoramas/classroom/%l/%s%y_%x",
				"fallbackPath" : "/img/panoramas/classroom/fallback/%s",
				"extension" : "jpg",
				"tileResolution" : 512,
				"maxLevel" : 4,
				"cubeResolution" : 2280
			},
			"hotSpots" : [{
					"pitch" : 5,
					"yaw" : 5,
					"type" : "info",
					"id" : 'pikachu',
					"imgSrc" : "img/artifacts/Pikachu_256px.png"

					//"required":[], //requires any one of the artifact from this list to activate (can be empty and then a click is enough)
					//"actions":[{"collect":"pikachu"},{"hideHotSpot":"pikachu"}],
					//other possible action:
					//{"collect":"pikachu"} //collect an artifact. can be the same artifact back or anything else
					//{"loadScene":"library"}
					//{"showHotSpot":"raichu"}
					//{"hideHotSpot":"pikachu"} //when you collect an artifact usualy that's what you want

					//onclick to be deleted
					// "onClick": "window.postMessage({artifactId : 'pikachu' }, '*'); console.log('clicked');"
				}, {
					"pitch" : -6,
					"yaw" : 0,
					"type" : "info"
				}, {
					"pitch" : 5,
					"yaw" : 24.2,
					"id" : 'door',
					"type" : "info",
					"imgSrc" : "img/artifacts/semi-trans.png",
					"required" : ["pikachu"],
					"actions" : [{
							"collect" : "pikachu"
						}
					],

				}, {
					"pitch" : -14,
					"yaw" : 33.2,
					"type" : "info"
				}, {
					"pitch" : -5.5,
					"yaw" : 45,
					"id" : 'raichu',
					"type" : "info",
					"imgSrc" : "img/artifacts/Raichu.png"
				}, {
					"pitch" : -14,
					"yaw" : 33.2,
					"type" : "info"
				}, {
					"pitch" : 10,
					"yaw" : 45,
					"id" : 'small-window',
					"type" : "scene",
					"sceneId" : "bma-1",
					"imgSrc" : "img/artifacts/semi-trans.png"
				}, {
					"pitch" : 0,
					"yaw" : 50,
					"type" : "info"
				}

			]
		},
		"bma-1" : {
			"type" : "equirectangular",
			"panorama" : "/img/panoramas/examples/bma-1.jpg",
			/*
			 * Uncomment the next line to print the coordinates of mouse clicks
			 * to the browser's developer console, which makes it much easier
			 * to figure out where to place hot spots. Always remove it when
			 * finished, though.
			 */
			//"hotSpotDebug": true,
			"hotSpots" : [{
					"pitch" : 10,
					"yaw" : 45,
					"id" : 'doorBack',
					"type" : "scene",
					"sceneId" : "classroom",
					"imgSrc" : "img/artifacts/semi-trans.png"
				}, {
					"pitch" : -14,
					"yaw" : 33.2,
					"type" : "info"
				}
			]
		},

	}
};

var gameState = {
	classroom : [{
			id : 'pikachu',
			shown : true,
			src : 'img/artifacts/Pikachu_64px.png',
			beingUsedBy : -1,
			required : [], //requires any one of the artifact from this list to activate (can be empty and then a click is enough)
			actions : [{
					"collect" : "pikachu"
				}, {
					"hideHotSpot" : "pikachu"
				}
			]
			//other possible action:
			//{"collect":"pikachu"} //collect an artifact. can be the same artifact back or anything else
			//{"loadScene":"library"}
			//{"showHotSpot":"raichu"}
			//{"hideHotSpot":"pikachu"} //when you collect an artifact usualy that's what you want
			//{"changeScene":"bma-1"}
		}, {
			id : 'door',
			shown : true,
			src : 'img/artifacts/semi-trans.png',
			beingUsedBy : -1,
			required : ["pikachu"],
			actions : [{
					"showHotSpot" : "raichu"
				}, {
					"objectMessage" : "you can open me with pikachu"
				}
			]
		}, {
			id : 'raichu',
			shown : false,
			src : 'img/artifacts/Raichu.png',
			beingUsedBy : -1,
			required : [],
			actions : [{
					"collect" : "raichu"
				}, {
					"hideHotSpot" : "raichu"
				}
			]
		}, {
			id : 'small-window',
			shown : true,
			//src : 'img/artifacts/Raichu.png',
			beingUsedBy : -1,
			required : [],
			actions : [{
					"changeScene" : "bma-1"
				}
			]
		}
	],
	'bma-1' : [{
			id : 'doorBack',
			shown : true,
			//src : 'img/artifacts/Raichu.png',
			beingUsedBy : -1,
			required : [],
			actions : [{
					"changeScene" : "classroom"
				}
			]
		}
	]
}

//recreate gameState from JSON
function getGameStateFromJSON(sourceJSON) {
	var forPanellum = sourceJSON;
	var res = {};
	for (let scene in forPanellum.scenes) {
		res[scene] = forPanellum.scenes[scene].hotSpots;
	}
}

function injectGameStateToJSON(gameState, sourceJSON) {
	//deep copy the source object
	var result = JSON.parse(JSON.stringify(sourceJSON));
	for (let scene in result.scenes) {
		console.log(result.scenes[scene].hotSpots);
		result.scenes[scene].hotSpots =
			result.scenes[scene].hotSpots.map(hotspot =>
				Object.assign(hotspot, gameState[scene].filter(hs => hs.id === hotspot.id)[0]));
		//		for (let i=0;i<result.scenes[scene].hotspots.length;i++){
		//			result.scenes[scene].hotspots[i] = Object.assign(result.scenes[scene].hotspots[i])
	}
	//result = Object.assign(result.scenes[scene].hotspots,gameState
	return result;
}

var res = injectGameStateToJSON(gameState, sourceJSON);
console.log(res);
alert(JSON.stringify(sourceJSON));
alert(JSON.stringify(res));
console.log();
console.log(JSON.stringify(res));