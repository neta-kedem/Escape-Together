import { Component, OnInit } from '@angular/core';
import { EscapeTogetherService } from './escapeTogetherService';

@Component({
    moduleId: module.id,
    selector: 'fixedPhoto',
    styles:[`.staticScene{
                width: 100%;
                height: 100%;
                position: absolute;
                /*top: 0;*/
                /*left: 0;*/
                z-index: 2;
                background-color: darkblue;
                margin: auto;
            }
            .staticImage{
                max-width: 100%;
                max-height: 100%;
                /*position: absolute;  */
                top: 0;  
                bottom: 0;  
                left: 0;  
                right: 0;  
                margin: auto;
            }`],
    template: `<div class="staticScene" *ngIf="escapeTogetherService.showModal">
                  <div style="overflow:hidden;position:relative;">
                    <img class="staticImage" [src]="escapeTogetherService.modalSrc" alt="a modal">
                    <img *ngFor="let hotSpot of escapeTogetherService.modalHotSpots" class="imageHotSpot" [ngStyle]="parseJSON(hotSpot.style)" src="{{hotSpot.imgSrc}}" id="{{hotSpot.id}}" onClick="window.postMessage(this.id,'*')" [hidden]="!hotSpot.shown">
                </div>
               </div>`
})
export class StaticSceneComponent implements OnInit {

    constructor(private escapeTogetherService:EscapeTogetherService) {}

    parseJSON(json) {
        return JSON.parse(json);
    }

    ngOnInit() {
    }

}