import {Component} from '@angular/core';
import {ChatRoomService} from './chat-room.service'
@Component({
    selector: 'chat-room',
    styles:[`
    *{font-family: Monaco, Consolas;}
    `],
    template: `
      <h2>{{(chatRoom.connected$ | async) ? "Connected!" : "Disconnected..."}}</h2>
      <input #i (keyup.enter)="chatRoom.send$.next(i.value); i.value = ''">
      <div *ngFor="let message of chatRoom.messages$ | async">
        {{message}}
      </div>
    `
})
export class ChatRoomComponent {
    constructor(private chatRoom : ChatRoomService) {
      
    }
}