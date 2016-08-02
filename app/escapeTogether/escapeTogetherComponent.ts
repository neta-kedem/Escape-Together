import { Component, OnInit } from '@angular/core';
import { BagComponent } from './bagComponent';
import { EscapeTogetherService } from './escapeTogetherService';
import { StaticSceneComponent } from './staticSceneComponent'


@Component({
	moduleId: module.id,
	// selector: 'escape',
	template: `
		<div id="father" style="width:100%;height:300px;">
			<fixedPhoto></fixedPhoto>
			<bag></bag>
			<div id="panorama" style="width:100%;"></div>
		</div>
		`,
	styleUrls: ['escapeTogetherComponent.css'],
	directives: [BagComponent, StaticSceneComponent],
	providers: [EscapeTogetherService]


})
export class EscapeTogetherComponent implements OnInit {
	constructor(public escapeTogetherService : EscapeTogetherService) { }

	ngOnInit() {
		let prmLoaded = this.escapeTogetherService.loadPannellum('panorama');
		prmLoaded.then(()=>{
			console.log('loading pannellum!');
			this.escapeTogetherService.start();
		});
	}

}