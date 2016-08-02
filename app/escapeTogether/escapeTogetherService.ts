import { Injectable } from '@angular/core';
import { GameState } from '../../server/gameState';
import * as io from 'socket.io-client';
import {IArtifact} from "../../server/gameState";

@Injectable()
export class EscapeTogetherService{
	
	// private gameState = new GameState([[{id:'pikachu', shown:true, src:'img/artifacts/Pikachu_256px.png', beingUsedBy:-1}]], 'gramsci', 'queer', 0);
	private _bags = [];
	private socket = io('localhost:3003/game');
	private _userId:number;
	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data);
			this.artifactClicked(msg.data);
		});
		this.socket.on('state update', (msg)=>{
			console.log('state updated:', msg);
			this._bags = msg.bags;

			msg.scenes[msg.players[this._userId].currScene].forEach((artifact:IArtifact)=>{
				let hsHtml=(<HTMLElement>document.querySelector('#'+artifact.id));
				if(hsHtml)
					hsHtml.style.display = artifact.shown? 'block': 'none'});
		});

		this.socket.on('login', (msg)=>{
			console.log('login:', msg);
			this._userId = msg.userId;
			this._bags = msg.bags;
			console.log(msg.scenes[msg.players[this._userId].currScene]);
			console.log(msg.scenes);
			msg.scenes[msg.players[this._userId].currScene].forEach((artifact)=>{
				console.log('artifact.id:',artifact.id);
				(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'
				});
		});
	}

	usedByOthers(artifact:IArtifact, userId:number):boolean{
		if((artifact.beingUsedBy !== -1) && (artifact.beingUsedBy !== userId) )	return true;
		return false;
	}

	bags(){return this._bags}

	userId(){return this._userId}

	artifactClicked(artifactId:string):void {
		this.socket.emit('userClick', artifactId);
		console.log('user click:', artifactId);
	}

	bagClicked(artifactId:string):void{
		this.socket.emit('bagedArtifactClicked', artifactId);
	}
}