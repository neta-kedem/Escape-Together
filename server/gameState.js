/**
 * Created by neta on 7/27/16.
 */
"use strict";
var GameState = (function () {
    function GameState(scenes, cb, playerName, playerGender, playerCurrScene) {
        var _this = this;
        if (playerCurrScene === void 0) { playerCurrScene = 'classroom'; }
        this.bags = []; //decide later the exact item structure
        this.players = [];
        //to put in some utility file
        this.flatten = function (list) { return list.reduce(function (acc, curr) { return acc.concat(Array.isArray(curr) ? _this.flatten(curr) : curr); }, []); };
        this.scenes = scenes;
        this.cb = cb;
        if (playerGender) {
            this.addPlayer(playerName, playerGender, playerCurrScene);
        }
    }
    //the mother of all the game logic
    GameState.prototype.sendStateToUsers = function () {
        this.cb({ bags: this.bags, players: this.players, scenes: this.scenes });
    };
    GameState.prototype.userClick = function (userId, artifactId) {
        var _this = this;
        console.log('game state totally knows ' + artifactId + ' was clicked');
        var userScene = this.players[userId].currScene;
        var clickedArtifact = this.scenes[userScene].filter(function (artifact) { return artifact.id === artifactId; })[0];
        // console.log(userScene, artifactId, this.scenes[userScene].filter((artifact)=>artifact.id===artifactId))
        // console.log('Checking reqs: item in hand:',this.players[userId].itemIdInHand,'requirements:',clickedArtifact.required,'clicked on:', clickedArtifact);
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.shown) {
            if (this.players[userId].itemIdInHand) {
                this.removeItemFromBag(this.players[userId].itemIdInHand);
            }
            // console.log('in if- the clicked art is shown:', clickedArtifact.required.indexOf(this.players[userId].itemIdInHand) >= 0);
            if (clickedArtifact.required.length === 0 || clickedArtifact.required.indexOf(this.players[userId].itemIdInHand) >= 0) {
                //this is the place to handle clickedArtifact.actions
                // console.log('Checking reqs: item in hand:',this.players[userId].itemIdInHand,'requirements:',clickedArtifact.required,'clicked on:', clickedArtifact);
                clickedArtifact.actions.forEach(function (action) {
                    switch (Object.keys(action)[0]) {
                        case 'collect':
                            console.log('');
                            console.log('collect:', _this.scenes[userScene].filter(function (hs) { return hs.id === action.collect; })[0]);
                            _this.bags[userId].push(_this.scenes[userScene].filter(function (hs) { return hs.id === action.collect; })[0]);
                            _this.unSelectItemInBag(userId);
                            console.log('totally collecting!');
                            break;
                        case 'loadScene':
                            console.log('load scene???????');
                            break;
                        case 'showHotSpot':
                            _this.unSelectItemInBag(userId);
                            _this.scenes[userScene].filter(function (hs) { return hs.id === action.showHotSpot; })[0].shown = true;
                            //this.flatten(this. scenes).filter(hs => hs.id === action.showHotSpot)[0].shown = true;
                            break;
                        case 'hideHotSpot':
                            _this.unSelectItemInBag(userId);
                            _this.scenes[userScene].filter(function (hs) { return hs.id === action.hideHotSpot; })[0].shown = false;
                            //this.flatten(this. scenes).filter(hs => hs.id === action.hideHotSpot)[0].shown = false;
                            break;
                        case 'changeScene':
                            _this.players[userId].currScene = action.changeScene;
                            //TODO: just update the user's scene. no need to call pannellum.
                            break;
                        case 'objectMessage':
                            console.log('objectMessage', action.objectMessage);
                            _this.objectMessage(userId, action.objectMessage);
                            break;
                    }
                });
            }
        }
        //here we shuld emmit to all the users about the new state
        this.sendStateToUsers();
    };
    //a happy new player joind the room
    GameState.prototype.addPlayer = function (name, gender, currScene) {
        if (currScene === void 0) { currScene = 'classroom'; }
        this.players.push({ name: name, gender: gender, currScene: currScene, itemIdInHand: null });
        this.bags.push([]);
        return { bags: this.bags, players: this.players, scenes: this.scenes, userId: this.players.length - 1 };
    };
    //an item in the bag section was clicked. the user can use it if no one else is using this
    GameState.prototype.bagedArtifactClicked = function (userId, artifactId) {
        var clickedArtifact = this.flatten(this.bags).filter(function (artifact) { return artifact.id === artifactId; })[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.beingUsedBy === -1) {
            clickedArtifact.beingUsedBy = userId;
            this.players[userId].itemIdInHand = clickedArtifact.id;
        }
        else if (this.players[userId].itemIdInHand === clickedArtifact.id) {
            this.unSelectItemInBag(userId);
        }
        else {
            console.log('someone else is playing with that ' + clickedArtifact.id);
        }
        //here we shuld emmit to all the users about the new state
        this.sendStateToUsers();
        //return {bags:this.bags, scene:this.scenes[userScene]}
    };
    ;
    GameState.prototype.unSelectItemInBag = function (userId) {
        var _this = this;
        if (this.players[userId].itemIdInHand) {
            var clickedArtifact = this.scenes[this.players[userId].currScene].filter(function (artifact) { return artifact.id === _this.players[userId].itemIdInHand; })[0];
            clickedArtifact.beingUsedBy = -1;
            this.players[userId].itemIdInHand = '';
        }
    };
    GameState.prototype.removeItemFromBag = function (artifactId) {
        console.log('removing:', artifactId);
        this.bags = this.bags.map(function (bag) {
            return bag.filter(function (artifact) {
                console.log('remrem', artifact);
                return artifact.id !== artifactId;
            });
        });
    };
    GameState.prototype.objectMessage = function (userId, message) {
    };
    return GameState;
}());
exports.GameState = GameState;
module.exports = GameState;
//# sourceMappingURL=gameState.js.map