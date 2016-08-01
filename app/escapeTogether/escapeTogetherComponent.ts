import { Component, OnInit } from '@angular/core';
import { BagComponent } from './bagComponent';
import { EscapeTogetherService } from './escapeTogetherService';

declare var pannellum: any;


@Component({
	moduleId: module.id,
	// selector: 'escape',
	template: `
		<div id="father" style="width:100%;height:300px;">
			<bag></bag>
			<div id="panorama" style="width:100%;"></div>
		</div>
		`,
	styleUrls: ['escapeTogetherComponent.css'],
	directives: [BagComponent],
	providers: [EscapeTogetherService]


})
export class EscapeTogetherComponent implements OnInit {
	constructor(public escapeTogetherService : EscapeTogetherService) { }

	view:any ={};

	ngOnInit() {
		this.view = pannellum.viewer('panorama', {
		  "default": {
			"firstScene": "classroom",
			// "author": "Escape",
			"autoLoad": true,
			"hotSpotDebug": true
		  },

		  "scenes": {
			"classroom": {
			  "title": "Escape Together",
			  "hfov": 100,
			  "pitch": 10,
			  "yaw": 50,
			  "northOffset": 289,
			  "type": "multires",
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
			  "multiRes": {
				"path": "/img/panoramas/classroom/%l/%s%y_%x",
				"fallbackPath": "/img/panoramas/classroom/fallback/%s",
				"extension": "jpg",
				"tileResolution": 512,
				"maxLevel": 4,
				"cubeResolution": 2280
			  },
			  "hotSpots": [
				{
				  "pitch": 5,
				  "yaw": 5,
				  "type": "info",
				  "id":'pikachu',
				  "imgSrc": "img/artifacts/Pikachu_256px.png"

				  //"required":[], //requires any one of the artifact from this list to activate (can be empty and then a click is enough)
				  //"actions":[{"collect":"pikachu"},{"hideHotSpot":"pikachu"}],
				  //other possible action: 
				  //{"collect":"pikachu"} //collect an artifact. can be the same artifact back or anything else
				  //{"loadScene":"library"}
				  //{"showHotSpot":"raichu"}
				  //{"hideHotSpot":"pikachu"} //when you collect an artifact usualy that's what you want
				  
				  //onclick to be deleted
				  // "onClick": "window.postMessage({artifactId : 'pikachu' }, '*'); console.log('clicked');"
				},
				{
				  "pitch": -6,
				  "yaw": 0,
				  "type": "info"
				},
				{
				  "pitch": 5,
				  "yaw": 24.2,
				  "id":'door',
				  "type": "info",
				  "imgSrc":"img/artifacts/semi-trans.png",
				  "required":["pikachu"],
				  "actions":[{"collect":"pikachu"}],

				},
				{
				  "pitch": -14,
				  "yaw": 33.2,
				  "type": "info"
				},
			  	{
				  "pitch": -5.5,
				  "yaw": 45,
				  "id":'raichu',
				  "type": "info",
				  "imgSrc":"img/artifacts/Raichu.png"
			  	},
			  	{
				  "pitch": -14,
				  "yaw": 33.2,
				  "type": "info"
			  	},
			  	{
				  "pitch": 10,
				  "yaw": 45,
				  "id":'small-window',
				  "type": "scene",
				  "sceneId": "bma-1",
				  "imgSrc":"img/artifacts/semi-trans.png"
			  	},
			  	{
				  "pitch": 0,
				  "yaw": 50,
				  "type": "info"
			  	}				

			  ]
			},
			 "bma-1": {    "type": "equirectangular",
    "panorama": "/img/panoramas/examples/bma-1.jpg",
    /*
     * Uncomment the next line to print the coordinates of mouse clicks
     * to the browser's developer console, which makes it much easier
     * to figure out where to place hot spots. Always remove it when
     * finished, though.
     */
    //"hotSpotDebug": true,
    "hotSpots": [
			  	{
				  "pitch": 10,
				  "yaw": 45,
				  "id":'doorBack',
				  "type": "scene",
				  "sceneId": "classroom",
				  "imgSrc":"img/artifacts/semi-trans.png"
			  	},
			  	{
				  "pitch": -14,
				  "yaw": 33.2,
				  "type": "info"
			  	}	
    ]},

		  }
		});
	}
}