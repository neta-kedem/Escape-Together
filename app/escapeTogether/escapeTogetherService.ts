import { Injectable } from '@angular/core';
import { GameState } from './gameState'

@Injectable()
export class EscapeTogetherService{
	
	// constructor() {}
	private gameState = new GameState([[{id:'pikachu', shown:true, src:'img/artifacts/Pikachu_256px.png'}]], 'gramsci', 'queer', 0);
	public bags = [];
	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data.artifactId);
			this.artifactClicked(msg.data.artifactId);})
	}

	artifactClicked(artifactId){
		console.log('artifactId:', artifactId);
		let currState = this.gameState.userClick(0, 0, artifactId);
		// this.artifacts.push('img/artifacts/Pikachu_256px.png');
		this.bags = currState.bags;
		currState.scene.forEach((artifact)=>{(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'});
		// document.querySelector('#'+artifactId).style="display:none";

	}

	bagClicked(artifactId){
		console.log('clicked in bag');
        let currState = this.gameState.bagedArtifactClicked(0, 0, artifactId);
	}

}