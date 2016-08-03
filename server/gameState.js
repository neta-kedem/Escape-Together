/**
 * Created by neta on 7/27/16.
 */
"use strict";
var GameState = (function () {
    function GameState(scenesData, cb, playerName, playerGender, playerCurrScene) {
        var _this = this;
        if (playerCurrScene === void 0) { playerCurrScene = 'classroom'; }
        this.bags = []; //decide later the exact item structure
        this.players = [];
        //to put in some utility file
        this.flatten = function (list) { return list.reduce(function (acc, curr) { return acc.concat(Array.isArray(curr) ? _this.flatten(curr) : curr); }, []); };
        this.scenes = scenesData.hotSpots;
        this.modals = scenesData.modals;
        this.cb = cb;
        if (playerGender) {
            this.addPlayer(playerName, playerGender, playerCurrScene);
        }
    }
    //the mother of all the game logic
    GameState.prototype.sendStateToUsers = function () {
        this.cb({ bags: this.bags, players: this.players, scenes: this.scenes, modals: this.modals });
    };
    GameState.prototype.findArtifactById = function (artifactId) {
        var theArtifact;
        for (var scene in this.scenes) {
            var foundItems = this.scenes[scene].filter(function (artifact) { return artifact.id === artifactId; });
            if (foundItems.length) {
                theArtifact = foundItems[0];
                break;
            }
        }
        return theArtifact;
    };
    GameState.prototype.userClick = function (userId, artifactId) {
        var _this = this;
        console.log('game state totally knows ' + artifactId + ' was clicked');
        var userScene = this.players[userId].currScene;
        var clickedArtifact;
        for (var scene in this.scenes) {
            var foundItems = this.scenes[scene].filter(function (artifact) { return artifact.id === artifactId; });
            if (foundItems.length) {
                clickedArtifact = foundItems[0];
                break;
            }
        }
        // let clickedArtifact:IArtifact = this.scenes[userScene].filter((artifact)=>artifact.id===artifactId)[0];
        console.log('***clicked***', clickedArtifact);
        //if the clicked artifact is shown (prevent bugs due to "clicking" an already hidden object due to communication lag)
        if (clickedArtifact.shown) {
            if ((!clickedArtifact.required.length && !this.players[userId].itemIdInHand) || clickedArtifact.required.indexOf(this.players[userId].itemIdInHand) >= 0) {
                //this is the place to handle clickedArtifact.actions
                if (this.players[userId].itemIdInHand) {
                    this.removeItemFromBag(this.players[userId].itemIdInHand);
                }
                clickedArtifact.actions.forEach(function (action) {
                    switch (Object.keys(action)[0]) {
                        case 'collect':
                            _this.bags[userId].push(_this.findArtifactById(action.collect));
                            _this.unSelectItemInBag(userId);
                            console.log('totally collecting!');
                            break;
                        case 'loadScene':
                            _this.players[userId].currScene = action.loadScene;
                            break;
                        case 'loadModal':
                            console.log('loading modal', action.loadModal);
                            _this.players[userId].currScene = action.loadModal;
                            break;
                        case 'showHotSpot':
                            _this.unSelectItemInBag(userId);
                            _this.findArtifactById(action.showHotSpot).shown = true;
                            break;
                        case 'hideHotSpot':
                            _this.unSelectItemInBag(userId);
                            _this.findArtifactById(action.showHotSpot).shown = false;
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
        return { bags: this.bags, players: this.players, scenes: this.scenes, modals: this.modals, userId: this.players.length - 1 };
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
        //here we should emmit to all the users about the new state
        this.sendStateToUsers();
    };
    ;
    GameState.prototype.unSelectItemInBag = function (userId) {
        var _this = this;
        if (this.players[userId].itemIdInHand) {
            this.bags.forEach(function (bag) {
                bag.forEach(function (artifact) {
                    if (artifact.id === _this.players[userId].itemIdInHand)
                        artifact.beingUsedBy = -1;
                    console.log('artifact.id:', artifact.id);
                });
            });
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