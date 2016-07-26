import { Injectable } from '@angular/core';

@Injectable()
export class EscapeTogetherService {
	
	constructor() {}
	public artifacts = ['img/artifacts/Pikachu_256px.png'];
	self = this;
	artifactClicked(event){
		console.log('this:', this.self);
		this.self.artifacts.push('img/artifacts/Pikachu_256px.png');
	}

	getArtifacts(){
		return this.artifacts;
	}
}