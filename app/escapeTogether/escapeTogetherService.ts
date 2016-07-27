import { Injectable } from '@angular/core';
import { GameState } from './gameState'

@Injectable()
export class EscapeTogetherService{
	
	// constructor() {}
	private gameState = new GameState([[{id:'pikachu',shown:true}]], 'gramsci', 'queer', 0);
	public artifacts = [];
	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data.artifactId);
			this.artifactClicked(msg.data.artifactId);})
	}

	artifactClicked(artifactId){
		console.log('artifactId:', artifactId);
		this.artifacts.push('img/artifacts/Pikachu_256px.png');
		document.querySelector('#'+artifactId).style="display:none";
		this.gameState.userClick(0, 0, 'pikachu');

		}

	getArtifacts(){
		return this.artifacts;
	}
}