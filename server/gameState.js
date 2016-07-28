/**
 * Created by neta on 7/27/16.
 */
"use strict";
var GameState = (function () {
    function GameState(scenes, playerName, playerGender, playerCurrScene) {
        var _this = this;
        if (playerCurrScene === void 0) { playerCurrScene = 0; }
        this.bags = []; //decide later the exact item structure
        this.players = [];
        //to put in some utility file
        this.flatten = function (list) { return list.reduce(function (acc, curr) { return acc.concat(Array.isArray(curr) ? _this.flatten(curr) : curr); }, []); };
        this.scenes = scenes;
        if (playerGender) {
            //for now, since we only have one player, we don't check the id. it can only be 0.
            this.addPlayer(playerName, playerGender, playerCurrScene);
        }
    }
    //the mother of all the game logic
    GameState.prototype.userClick = function (userId, userScene, artifactId) {
        console.log('game state totally knows ' + artifactId + ' was clicked');
        var clickedArtifact = this.scenes[userScene].filter(function (artifact) { return artifact.id === artifactId; })[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.shown) {
            clickedArtifact.shown = false;
            this.bags[userId].push(clickedArtifact);
        }
        //here we shuld emmit to all the users about the new state
        return { bags: this.bags, scene: this.scenes[userScene] };
    };
    GameState.prototype.addPlayer = function (name, gender, currScene) {
        if (currScene === void 0) { currScene = 0; }
        //a happy new player joind the room
        this.players.push({ name: name, gender: gender, currScene: currScene, itemIdInHand: null });
        this.bags.push([]);
        return this.players.length - 1;
    };
    GameState.prototype.bagedArtifactClicked = function (userId, userScene, artifactId) {
        var clickedArtifact = this.flatten(this.bags.map(function (bag) {
            return bag.filter(function (artifact) {
                return artifact.id === artifactId;
            });
        }))[0];
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (!clickedArtifact.isBeingUsed) {
            clickedArtifact.isBeingUsed = true;
            this.players[userId].itemIdInHand = clickedArtifact.id;
        }
        else if (this.players[userId].itemIdInHand === clickedArtifact.id) {
            clickedArtifact.isBeingUsed = false;
            this.players[userId].itemIdInHand = '';
        }
        else {
            console.log('someone else is playing with that ' + clickedArtifact.id);
        }
        //here we shuld emmit to all the users about the new state
        return { bags: this.bags, scene: this.scenes[userScene] };
    };
    ;
    return GameState;
}());
exports.GameState = GameState;
//# sourceMappingURL=gameState.js.map