import { PLATFORM_DIRECTIVES } from '@angular/core';
import {AppComponent} from './app.component';
import {MonsterListComponent} from './monster/monster-list.component';
import {MonsterComponent} from './monster/monster.component';
import {MonsterEditComponent} from './monster/monster-edit.component';
import {ChatRoomComponent} from './chat/chat-room.component';
import {EscapeTogetherComponent} from './escapeTogether/escapeTogetherComponent';
import { RouterConfig, ROUTER_DIRECTIVES, provideRouter } from '@angular/router';

const routes: RouterConfig = [
  { path: 'app', component: AppComponent },
  { path: 'monster', component: MonsterListComponent },
  { path: 'monster/edit', component: MonsterEditComponent },
  { path: 'monster/edit/:id', component: MonsterEditComponent },
  { path: 'monster/:id/:name', component: MonsterComponent },
  { path: 'chat', component: ChatRoomComponent },
  { path: '', component: EscapeTogetherComponent }
  { path: 'escapeTogether', component: EscapeTogetherComponent }

];

export const ROUTER_PROVIDERS = [
  provideRouter(routes),
  {provide: PLATFORM_DIRECTIVES, useValue: ROUTER_DIRECTIVES, multi: true}
];
