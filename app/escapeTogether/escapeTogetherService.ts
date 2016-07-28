import { Injectable } from '@angular/core';
import { GameState } from './gameState'
import * as io from 'socket.io-client';

@Injectable()
export class EscapeTogetherService{
	
	private gameState = new GameState([[{id:'pikachu', shown:true, src:'img/artifacts/Pikachu_256px.png', isBeingUsed:false}]], 'gramsci', 'queer', 0);
	public bags = [];
	private socket = io('192.168.0.100:3003/game');

	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data.artifactId);
			this.artifactClicked(msg.data.artifactId);
		});
		// this.socket.emit('')
		this.socket.on('state update', (msg)=>{
			console.log('state updated:', msg);});
	}

	artifactClicked(artifactId:string):void {
		let currState = this.gameState.userClick(0, 0, artifactId);
		this.socket.emit('userClick', artifactId);
		this.bags = currState.bags;
		currState.scene.forEach((artifact)=>{(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'});
	}

	bagClicked(artifactId:string):void{
        let currState = this.gameState.bagedArtifactClicked(0, 0, artifactId);
	}

}