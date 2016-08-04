const SERVER_URL=window.location.hostname+':3003/game';

import { Injectable } from '@angular/core';
import { GameState } from '../../server/gameState';
import * as io from 'socket.io-client';
import {IArtifact} from "../../server/gameState";
import {Http} from '@angular/http';

declare var pannellum: any;

@Injectable()
export class EscapeTogetherService{
	
	private _bags = [];
	private socket;
	private _userId:number;
    private _currScene:string;
	private modals;
	private _scenes;
	public view:any;
	public modalSrc:string;
	public showModal:boolean = false;
	public modalHotSpots:any[];
	private isPannellumOnLoadActive = false;

	constructor(private http:Http){
		window.addEventListener('message' , (msg)=>{
			console.log('on message', msg.data);
			this.artifactClicked(msg.data);
		});
	}
	
	activatePannellumOnLoad(){
		if (!this.isPannellumOnLoadActive){
			this.isPannellumOnLoadActive = true;
				this.view.on('load', ()=>{
						console.warn('load event fired to ',this._currScene);
						this._scenes[this._currScene].forEach((artifact:IArtifact)=>{
							let hsHtml=(<HTMLElement>document.querySelector('#'+artifact.id));
							if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
							else console.warn('#' + artifact.id+ ' not found in DOM in if');
						});
					});
		}
	};
	
	start(){
	 	this.socket = io(SERVER_URL);
		this.socket.on('message',(msg)=>{
			if (msg.userId === this._userId){
				let b = <HTMLElement>document.querySelector('.pnlm-title-box');
				if (!(b.childElementCount && b.children[b.childElementCount-1].textContent === msg.message)){
					let now=Date.now();
					b.innerHTML += '<div id="msg'+now +'">' + msg.message + '</div>';
					setTimeout(()=> {document.querySelector('#msg'+now).remove()},2000);
				}
			}
		});
		this.socket.on('sound',(msg)=>{
			if (msg.userId === this._userId) {
				console.log('soundy sound:');
			}
		});
		this.socket.on('state update', (msg)=>{
			console.log('state updated:', msg);

			if(msg.hasOwnProperty('userId')){
				this._userId = msg.userId;
				this.modals = msg.modals;
			}
			this._bags = msg.bags;

			const scene = msg.players[this._userId].currScene;
			this._scenes = msg.scenes;
			if(this._currScene !== scene){
				this._currScene = scene;
				console.log('msg', msg);
				//we have a modal scene
                if(this.modals.hasOwnProperty(scene)){
					this.modalSrc = this.modals[scene].modalSrc;
					this.showModal = true;
					this.modalHotSpots = msg.scenes[scene];
					console.log('this.modalHotSpots:', this.modalHotSpots);
                }
                //in case of a normal scene
                else{
					this.showModal = false;
                	this.view = this.view.loadScene(scene, 0, 0, 100);
					this.activatePannellumOnLoad();
                }
			}

				msg.scenes[scene].forEach((artifact:IArtifact)=>{
					let hsHtml=(<HTMLElement>document.querySelector('#'+artifact.id));
					if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
					else console.warn('#' + artifact.id+ ' not found in DOM');
				});
		});
	}

	loadPannellum(elId){
		return new Promise((resolve,reject) => {
			this.http.get('/server/json/data.json').toPromise().then((res:any) => {
				this.view = pannellum.viewer(elId, eval('(' + res._body + ')'));
				resolve();
				// this.view.on('load', resolve);
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