import { Component, OnInit } from '@angular/core';
import {MonsterModel} from './monster.model';

@Component({
  moduleId: module.id,
  selector: 'monster-thumb',
  styleUrls: [`monster.css`],
  inputs: ['monster'],
  template: `
          <section>
            <p>{{monster.name}}</p>
            <a routerLink="/monster/{{monster.id}}/{{monster.name}}">
              <img class="imgMonster" [src]="monster.getImgUrl()" />
            </a>
            <h6>Power: {{monster.power}}</h6>

          </section>
          `

})
export class MonsterThumbComponent implements OnInit {

  private monster : MonsterModel;

  constructor() { }

  ngOnInit() { }

}
