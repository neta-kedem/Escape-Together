import { Injectable } from '@angular/core';
import { GameState } from './gameState'

@Injectable()
export class EscapeTogetherService{
	
	private gameState = new GameState([[{id:'pikachu', shown:false, src:'img/artifacts/Pikachu_256px.png', isBeingUsed:false}]], 'gramsci', 'queer', 0);
	public bags = [];
	constructor(){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data.artifactId);
			this.artifactClicked(msg.data.artifactId); })


	}

	artifactClicked(artifactId:string):void{
		let currState = this.gameState.userClick(0, 0, artifactId);
		// this.artifacts.push('img/artifacts/Pikachu_256px.png');
		this.bags = currState.bags;
		currState.scene.forEach((artifact)=>{(<HTMLElement>document.querySelector('#'+artifact.id)).style.display = artifact.shown? 'block': 'none'});

	}

	bagClicked(artifactId:string):void{
        let currState = this.gameState.bagedArtifactClicked(0, 0, artifactId);
	}

}