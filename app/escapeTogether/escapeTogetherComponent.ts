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
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/server/json/data.json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				//alert('User\'s name is ' + xhr.responseText);
				this.view = pannellum.viewer('panorama', eval('('+xhr.responseText+')'));

			}
			else {
				alert('Request failed.  Returned status of ' + xhr.status);
			}
		};
		xhr.send();
	}
}