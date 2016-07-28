import { Component, OnInit } from '@angular/core';
import { EscapeTogetherService } from './escapeTogetherService';

@Component({
	moduleId: module.id,
	selector: 'bag',
	template: `
				<div class="bag">
					<div *ngFor="let bag of escapeTogetherService.bags">
						<img (click)="escapeTogetherService.bagClicked(artifact.id)" *ngFor="let artifact of bag" src="{{artifact.src}}" height="64" width="64" [class.inUse]="artifact.isBeingUsed"/>
						<hr>
					</div>
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
            }
            .inUse{
                /*opacity: 0.5;*/
                background-color: gold;
            }`]
	// providers:[EscapeTogetherService]
})
export class BagComponent implements OnInit {

	artifacts;
	constructor(private escapeTogetherService:EscapeTogetherService) { }

	ngOnInit() {

	}

	
}