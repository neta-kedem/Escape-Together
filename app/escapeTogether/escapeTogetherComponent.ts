import { Component, OnInit } from '@angular/core';
declare var pannellum: any;


@Component({
	moduleId: module.id,
	// selector: 'escape',
	template: `
		<div id="father" style="width:100%;height:300px;">
			<div id="panorama" style="width:100%;"></div>
			<button (click)="setPikachu()">pikapika!!</button>
		</div>
		`

})
export class escapeTogetherComponent implements OnInit {
	constructor() { }

	view:any ={};
  
	ngOnInit() {
		console.log('hi!');
		this.view = pannellum.viewer('panorama', {
		  "default": {
			"firstScene": "library",
			// "author": "Escape",
			"autoLoad": true,
			"hotSpotDebug": true
		  },

		  "scenes": {
			"library": {
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
				  // "imageSrc": "Pikachu_256px.png"
				  // "text": "I am a happy pikachu"
				},
				{
				  "pitch": -6,
				  "yaw": 10,
				  "type": "info"
				  // "text": "I am a happy pikachu"
				},
				{
				  "pitch": -6,
				  "yaw": 0,
				  "type": "info"
				  // "text": "my lag"
				},
				{
				  "pitch": 5,
				  "yaw": 15,
				  "type": "info"
				  // "text": "I am a happy pikachu"
				},
				{
				  "pitch": -5,
				  "yaw": 30,
				  "sceneId": "house"
				  // "text": "I am a happy pikachu"
				}
			  ]
			},
		  }
		});
	}
	setPikachu(){
	    console.log('catch it',this.view);
	    var a = document.querySelector('div.pnlm-hotspot');
	    // console.log(a);
	    a.innerHTML += '<img src="img/artifacts/Pikachu_256px.png" height="64" width="64" onClick="clicked(this);"/>';
	    this.view.setPitch(this.view.getPitch());
	}
}