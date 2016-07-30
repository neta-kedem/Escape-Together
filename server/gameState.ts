/**
 * Created by neta on 7/27/16.
 */

/*
 state= {
    bags: [ bag: [ ] ],
    scenes: [scene[ {hotspots: [
                                IArtifact: {id:string, shown:boolean, src:string}
                               ]
                    }
                  ]
            ],
     players: [
                IPlayer: {name:string, gender:string, currScene:number, itemIdInHand:string}
              ]
 }

 */
export interface IPlayer{name:string, gender:string, currScene:number, itemIdInHand:string}
export interface IArtifact{id:string,shown:boolean, src:string, beingUsedBy:number}

export class GameState {
    private bags:Object[][]=[];   //decide later the exact item structure
    private players:IPlayer[]=[];
    private scenes:IArtifact[][];
	private cb;
	

    constructor(scenes:IArtifact[][], cb, playerName?:string, playerGender?:string, playerCurrScene:number = 0 ){
        this.scenes=scenes;
		this.cb=cb;
        if (playerGender){
            this.addPlayer(playerName,playerGender,playerCurrScene);
        }
    }

    //the mother of all the game logic
    sendStateToUsers(){
		this.cb({bags:this.bags,players:this.players,scenes:this.scenes});
	}
	
	userClick(userId, artifactId){
        console.log('game state totally knows ' + artifactId + ' was clicked');
		const userScene = this.players[userId].currScene;
		console.log('userId:',userId,' currscene:',this.players[userId].currScene);
        let clickedArtifact=this.scenes[userScene].filter((artifact)=>artifact.id===artifactId)[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        console.log('artifact:',clickedArtifact)
		if(clickedArtifact.shown){

            clickedArtifact.shown = false;
            this.bags[userId].push(clickedArtifact);
        }
        //here we shuld emmit to all the users about the new state
		
        //return {bags:this.bags, scene:this.scenes[userScene]}
		this.sendStateToUsers();
    }

    addPlayer(name:string, gender:string, currScene:number = 0){
        //a happy new player joind the room
        this.players.push({name:name, gender:gender, currScene:currScene, itemIdInHand:null});
        this.bags.push([]);
		
        return {bags:this.bags,players:this.players,scenes:this.scenes,userId:this.players.length - 1};
    }

    //to put in some utility file
    flatten = list => list.reduce(
    (acc, curr) => acc.concat(Array.isArray(curr) ? this.flatten(curr) : curr), []);


    bagedArtifactClicked(userId, artifactId){
        const clickedArtifact:IArtifact = this.flatten(this.bags.map((bag)=>{
            return bag.filter((artifact:IArtifact)=>{
                return artifact.id===artifactId
            });
        }))[0];

        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if(clickedArtifact.beingUsedBy=== -1) {
            clickedArtifact.beingUsedBy = userId;
            this.players[userId].itemIdInHand = clickedArtifact.id;
        }
        else if(this.players[userId].itemIdInHand === clickedArtifact.id){
            clickedArtifact.beingUsedBy = -1;
            this.players[userId].itemIdInHand = '';
        } else{
            console.log('someone else is playing with that '+clickedArtifact.id);
        }
        //here we shuld emmit to all the users about the new state
		this.sendStateToUsers();
        //return {bags:this.bags, scene:this.scenes[userScene]}
    };

}

module.exports = GameState;