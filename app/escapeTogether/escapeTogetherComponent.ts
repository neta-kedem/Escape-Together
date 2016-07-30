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
			"hotSpotDebug": false
		  },

		  "scenes": {
			"classroom": {
			  "title": "Escape Together",
			  "hfov": 100,
			  "pitch": 10,
			  "yaw": 50,
			  "northOffset": 289,
			  "type": "multires",
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
				  "imgSrc": "img/artifacts/Pikachu_256px.png",
				  "required":[], //requires any one of the artifact from this list to activate (can be empty and then a click is enough)
				  "actions":[{"collect":"pikachu"},{"hideHotSpot":"pikachu"}],
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
				  "pitch": -6,
				  "yaw": 5,
				  "type": "info"
				},
				{
				  "pitch": 5,
				  "yaw": 0,
				  "type": "info"
				},

			  ]
			},
		  }
		});
	}
}