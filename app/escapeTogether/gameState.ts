/**
 * Created by neta on 7/27/16.
 */

export interface IPlayer{name:string, gender:string, currScene:number}
export interface IArtifact{id:string,shown:boolean, src:string, isBeingUsed:boolean}

export class GameState {
    // private state = {};
    private bags:Object[][]=[];   //decide later the exact item structure
    private players:IPlayer[]=[];
    private scenes:IArtifact[][];

    constructor(scenes:IArtifact[][], playerName?:string, playerGender?:string, playerCurrScene:number = 0 ){
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
            console.log('clickedArtifact:', clickedArtifact);
            console.log('userId:', userId);
        }
        //here we shuld emmit to all the users about the new state
        return {bags:this.bags, scene:this.scenes[userScene]}
    }

    addPlayer(name:string, gender:string, currScene:number = 0){
        //a happy new player joind the room
        this.players.push({name:name, gender:gender, currScene:currScene});
        this.bags.push([]);
        return this.players.length - 1;
    }

    bagedArtifactClicked(userId, userScene, artifactId){
        console.log('game state totally knows ' + artifactId + ' was clicked in the bag');
        //need to be fixed!!!
        const clickedArtifact = this.bags.map((bag)=>{bag.filter((artifact:IArtifact)=>artifact.id===artifactId)}).concat();
        console.log('clickedArtifact',clickedArtifact);
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if(clickedArtifact.shown){
            clickedArtifact.shown = false;
            this.bags[userId].push(clickedArtifact);
            console.log('clickedArtifact:', clickedArtifact);
            console.log('userId:', userId);
        }
        //here we shuld emmit to all the users about the new state
        return {bags:this.bags, scene:this.scenes[userScene]}
    }

}