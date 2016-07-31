/**
 * Created by neta on 7/27/16.
 */
"use strict";
var GameState = (function () {
    function GameState(scenes, cb, playerName, playerGender, playerCurrScene) {
        var _this = this;
        if (playerCurrScene === void 0) { playerCurrScene = 0; }
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
        console.log('userId:', userId, ' currscene:', this.players[userId].currScene);
        var clickedArtifact = this.scenes[userScene].filter(function (artifact) { return artifact.id === artifactId; })[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        // console.log('artifact:',clickedArtifact);
        if (clickedArtifact.shown) {
            //todo: check if iteminhand meets clickedArtifact.required
            // console.log('clickedArtifact:',clickedArtifact);
            //this is the place to handle clickedArtifact.actions
            clickedArtifact.actions.forEach(function (action) {
                switch (Object.keys(action)[0]) {
                    case 'collect':
                        _this.bags[userId].push(clickedArtifact);
                        console.log('totally collecting!');
                        break;
                    case 'loadScene':
                        break;
                    case 'showHotSpot':
                        _this.flatten(_this.scenes).filter(function (hs) { return hs.id === action.showHotSpot; })[0].shown = true;
                        break;
                    case 'hideHotSpot':
                        console.log('hotspot to hide:', _this.flatten(_this.scenes).filter(function (hs) { return hs.id === action.hideHotSpot; })[0]);
                        _this.flatten(_this.scenes).filter(function (hs) { return hs.id === action.hideHotSpot; })[0].shown = false;
                        break;
                }
            });
        }
        //here we shuld emmit to all the users about the new state
        this.sendStateToUsers();
    };
    //a happy new player joind the room
    GameState.prototype.addPlayer = function (name, gender, currScene) {
        if (currScene === void 0) { currScene = 0; }
        this.players.push({ name: name, gender: gender, currScene: currScene, itemIdInHand: null });
        this.bags.push([]);
        return { bags: this.bags, players: this.players, scenes: this.scenes, userId: this.players.length - 1 };
    };
    //an item in the bag section was clicked. the user can use it if no one else is using this
    GameState.prototype.bagedArtifactClicked = function (userId, artifactId) {
        var clickedArtifact = this.flatten(this.bags.map(function (bag) {
            return bag.filter(function (artifact) {
                return artifact.id === artifactId;
            });
        }))[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.beingUsedBy === -1) {
            clickedArtifact.beingUsedBy = userId;
            this.players[userId].itemIdInHand = clickedArtifact.id;
        }
        else if (this.players[userId].itemIdInHand === clickedArtifact.id) {
            clickedArtifact.beingUsedBy = -1;
            this.players[userId].itemIdInHand = '';
        }
        else {
            console.log('someone else is playing with that ' + clickedArtifact.id);
        }
        //here we shuld emmit to all the users about the new state
        this.sendStateToUsers();
        //return {bags:this.bags, scene:this.scenes[userScene]}
    };
    ;
    return GameState;
}());
exports.GameState = GameState;
module.exports = GameState;
//# sourceMappingURL=gameState.js.map