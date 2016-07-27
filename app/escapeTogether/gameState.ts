/**
 * Created by neta on 7/27/16.
 */
import {Observable, Subject} from 'rxjs/Rx';
import * as io from 'socket.io-client';

export class GameState {

    // private state = {};
    private bags:any[][]=[];   //decide later the exact item structure
    private players:{name:string, gender:string, currScene:number}[]=[];
    private scenes:{id:string,shown:boolean}[][];

    constructor(scenes:{id:string,shown:boolean}[][], playerName?:string, playerGender?:string, playerCurrScene:number = 0, ){
        this.scenes=scenes;
        if (playerGender){
            //for now, since we only have one player, we don't check the id. it can only be 0.
            this.addPlayer(playerName,playerGender,playerCurrScene);
        }
    }

    userClick(userId, userScene, artifactId){
        console.log('game state totally knows ' + artifactId + ' was clicked');
        let clickedArtifact=this.scenes[userScene].filter((artifact)=>artifact.id===artifactId)[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if(clickedArtifact.shown){
            clickedArtifact.shown = false;
            this.bags[userId].push(clickedArtifact);
            console.log('this.bags:', this.bags);
            console.log('userId:', userId);
        }
        //here we shuld emmit to all the users about the new state
    }

    addPlayer(name:string, gender:string, currScene:number = 0){
        //a happy new player joind the room
        this.players.push({name:name, gender:gender, currScene:currScene});
        this.bags.push([]);
        return this.players.length - 1;
    }


}