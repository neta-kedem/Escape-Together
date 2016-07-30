import { Injectable } from '@angular/core';
import { GameState } from '../../server/gameState';
import * as io from 'socket.io-client';
import {IArtifact} from "../../server/gameState";

@Injectable()
export class EscapeTogetherService{
	
	// private gameState = new GameState([[{id:'pikachu', shown:true, src:'img/artifacts/Pikachu_256px.png', beingUsedBy:-1}]], 'gramsci', 'queer', 0);
	private _bags = [];
	// private socket = io('192.168.0.100:3003/game');
	private socket = io('192.168.1.5:3003/game');
	private _userId:number;
	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data.artifactId);
			this.artifactClicked(msg.data.artifactId);
		});
		// this.socket.emit('')
		this.socket.on('state update', (msg)=>{
			console.log('state updated:', msg);
			this._bags = msg.bags;
			msg.scenes[0].forEach((artifact)=>{(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'});
		});
		this.socket.on('login', (msg)=>{
			console.log('login:', msg);
			this._userId = msg.userId;
			this._bags = msg.bags;
			msg.scenes[msg.players[this._userId].currScene].forEach((artifact)=>{(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'});
		});
	}

	usedByOthers(artifact:IArtifact, userId:number):boolean{
		console.log('artifact:', artifact);
		console.log('userId:', userId);
		if((artifact.beingUsedBy !== -1) && (artifact.beingUsedBy !== userId) )
			return true;
		return false;
	}

	bags(){return this._bags}
	userId(){return this._userId}
	artifactClicked(artifactId:string):void {
		// let currState = this.gameState.userClick(0, 0, artifactId);

		// a super important line i disabled that for development
		this.socket.emit('userClick', artifactId);
		}

	bagClicked(artifactId:string):void{
        // let currState = this.gameState.bagedArtifactClicked(0, 0, artifactId);
		this.socket.emit('bagedArtifactClicked', artifactId);

	}

}