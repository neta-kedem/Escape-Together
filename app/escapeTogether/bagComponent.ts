import { Component, OnInit } from '@angular/core';
import { EscapeTogetherService } from './escapeTogetherService';

@Component({
	moduleId: module.id,
	selector: 'bag',
	template: `
 				<!--<button (click)="escapeTogetherService.artifacts[3]='img/artifacts/Pikachu_256px.png'"></button>-->
				<div class="bag">
					<img *ngFor="let artifact of escapeTogetherService.artifacts" src="{{artifact}}" height="64" width="64"/>
				</div>
				`,
	styles:[`.bag{
				    position: absolute;
				    /*bottom: 4px;*/
				    right: 0px;
				    height: inherit;
				    width: 100px;
				    display: block;
				    background-color: rgba(0,0,0,0.7);
				    border-radius: 0 3px 3px 0;
				    /*padding-right: 10px;*/
				    color: #fff;
				    text-align: left;
				    z-index: 2;
				    /*display: none;*/
				    /* Fix Safari fullscreen bug */
				    /*-webkit-transform: translateZ(9999px);*/
				    /*transform: translateZ(9999px);*/
				}`],
	// providers:[EscapeTogetherService]
})
export class BagComponent implements OnInit {

	artifacts;
	constructor(private escapeTogetherService:EscapeTogetherService) { }

	ngOnInit() {
		this.artifacts = this.escapeTogetherService.getArtifacts();
		console.log('get artifacts');
	}

	
}