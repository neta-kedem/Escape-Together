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
export interface IArtifact{id:string,shown:boolean, src:string, beingUsedBy:number, required:IArtifact[], actions:{any}[]}

export class GameState {
    private bags:Object[][]=[];   //decide later the exact item structure
    private players:IPlayer[]=[];
    private scenes:IArtifact[][];
	private cb;


    //to put in some utility file
    flatten = list => list.reduce(
        (acc, curr) => acc.concat(Array.isArray(curr) ? this.flatten(curr) : curr), []);

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
	
	userClick(userId:number, artifactId:string){
        console.log('game state totally knows ' + artifactId + ' was clicked');
		const userScene = this.players[userId].currScene;
		console.log('userId:',userId,' currscene:',this.players[userId].currScene);
        let clickedArtifact = this.scenes[userScene].filter((artifact)=>artifact.id===artifactId)[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)

		if(clickedArtifact.shown){
			// if (clickedArtifact.required.length===0||
             //   (this.players[userId].itemIdInHand.length >0 && clickedArtifact.required.indexOf(this.players[userId].itemIdInHand.id)>=0)){
            console.log('$var:', clickedArtifact.required.indexOf(this.players[userId].itemIdInHand)>=0);
            if (clickedArtifact.required.length === 0 || clickedArtifact.required.indexOf(this.players[userId].itemIdInHand)>=0){
                //todo: check if iteminhand meets clickedArtifact.required
                // console.log('clickedArtifact:',clickedArtifact);
                //this is the place to handle clickedArtifact.actions
                console.log('Checking reqs: item in hand:',this.players[userId].itemIdInHand,'requirements:',clickedArtifact.required,'clicked on:', clickedArtifact);

            clickedArtifact.actions.forEach((action:any)=>{
				switch (Object.keys(action)[0]){
					case 'collect':
					    let idToCollact = action.collact;
                        this.bags[userId].push(this.flatten(this. scenes).filter(hs => hs.id === action.collect)[0]);
                        console.log('totally collecting!');
                        break;
					case 'loadScene':
                        break;
					case 'showHotSpot':
                        this.flatten(this. scenes).filter(hs => hs.id === action.showHotSpot)[0].shown = true;
                        break;
                    case 'hideHotSpot':
                        //console.log('hotspot to hide:', this.flatten(this. scenes).filter(hs => hs.id === action.hideHotSpot)[0]);
						this.flatten(this. scenes).filter(hs => hs.id === action.hideHotSpot)[0].shown = false;
                        break;
				}
			});
        }
		}
		
        //here we shuld emmit to all the users about the new state
		this.sendStateToUsers();
    }

    //a happy new player joind the room
    addPlayer(name:string, gender:string, currScene:number = 0){
        this.players.push({name:name, gender:gender, currScene:currScene, itemIdInHand:null});
        this.bags.push([]);
		
        return {bags:this.bags,players:this.players,scenes:this.scenes,userId:this.players.length - 1};
    }

    //an item in the bag section was clicked. the user can use it if no one else is using this
    bagedArtifactClicked(userId, artifactId){
		const clickedArtifact:IArtifact = this.flatten(this.bags).filter((artifact:IArtifact)=>artifact.id===artifactId)[0];

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