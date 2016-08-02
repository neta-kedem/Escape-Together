import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'fixedPhoto',
    styles:[`.staticScene{
                width: 100%;
                height: 100%;
                z-index: 3;
}`],
    template: '<div class="staticScene"></div>'
})
export class StaticSceneComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}