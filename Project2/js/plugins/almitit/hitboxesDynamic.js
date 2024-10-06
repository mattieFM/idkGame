//to use outside of this project rewrite mv3d's targetChar system

const baseRectXML = "<collider><rect x='0' y='0' width='1' height='1' /></collider>";
const baseCircleXML ="<collider><circle cx='0.5' cy='0.7' r='0.25' /></collider>"

const baseRect=Game_System.prototype.createColliderFromXML(baseRectXML);
const baseCircle=Game_System.prototype.createColliderFromXML(baseCircleXML);


(()=>{

    var baseGameEventColider = Game_Event.prototype.collider;
    Game_Event.prototype.collider = function(){
        if(this.forceCollider) return this.forceCollider;
        return baseGameEventColider.call(this);
    }


    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function( command, args ) {
        Game_Interpreter_pluginCommand.call( this, command, args );
        if ( command === 'AltMovement' ) {
            if(args.shift() === "MCollider"){
                console.log("here")
                const targetStr = args.shift()
                console.log(targetStr);
                var target = window.mv3d.targetChar(targetStr, $gameMap.event(this._eventId));
                console.log(target);
                if(target){
                    args.forEach((cmd)=>{
                        console.log("cmd")
                        const splitCmd = cmd.split("(");
                        const cmdName = splitCmd[0];
                        const cmdArgs = (splitCmd[1].split(")")[0]).split(",");
                        let collider;
                        if(cmdName.includes("rect")){
                            console.log("rect")
                           let rect = JSON.parse(JSON.stringify(baseRect));
                           console.log(rect)
                           rect.x=parseFloat(cmdArgs[0]);
                           rect.y=parseFloat(cmdArgs[1]);
                           rect.width=parseFloat(cmdArgs[2]);
                           rect.height=parseFloat(cmdArgs[3]);
                           rect.aabbox.right=rect.width-rect.x;
                           rect.aabbox.bottom=rect.height-rect.y;
                           rect.aabbox.left=rect.x;
                           rect.aabbox.top=rect.y;
                           console.log(rect)
                           collider=rect;
                           console.log(collider)
                        } else if(cmdName.includes("circle")) {
                            let circle = JSON.parse(JSON.stringify(baseRect));
                            circle.cx=parseFloat(cmdArgs[0]);
                            circle.cy=parseFloat(cmdArgs[1]);
                            circle.r=parseFloat(cmdArgs[2]);
                            collider=circle;
                        }
                        if(collider) target.forceCollider=collider;
                    })
                }
                
                
            }
        } else if (command ==="setCollider"){
            const targetStr = args.shift()
            var target = window.mv3d.targetChar(targetStr, $gameMap.event(this._eventId));
            target.forceCollider=Game_System.prototype.createColliderFromXML(args.join(" "));
        }
    }
})();



// if($gameSystem.hitboxTriggers || true){
//     Game_Event.prototype.checkEventTriggerTouch = function( x, y ) {
//         if ( this._trigger === 2 && !$gameMap.isEventRunning() && !this.isJumping() && this.isNormalPriority() ) {
//           var bboxTests = $gameMap.getAABBoxTests( this, x - this._x, y - this._y );
//           var loopMap = -1;
//           for ( var ii = 0; ii < bboxTests.length; ii++ ) {
//             if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, $gamePlayer._x, $gamePlayer._y, $gamePlayer.collider().aabbox ) ) {
//               loopMap = bboxTests[ii].type;
//               break;
//             }
//           }

//           if ( loopMap < 0 ) {
//             return;
//           }

//           var playerX = $gamePlayer._x;
//           var playerY = $gamePlayer._y;

//           if ( loopMap == 1 ) { playerX += $gameMap.width(); }
//           else if ( loopMap == 2 ) { playerX -= $gameMap.width(); }
//           else if ( loopMap == 3 ) { playerY += $gameMap.height(); }
//           else if ( loopMap == 4 ) { playerY -= $gameMap.height(); }
//           else if ( loopMap == 5 ) { playerX += $gameMap.width(); playerY += $gameMap.height(); }
//           else if ( loopMap == 6 ) { playerX -= $gameMap.width(); playerY += $gameMap.height(); }
//           else if ( loopMap == 7 ) { playerX += $gameMap.width(); playerY -= $gameMap.height(); }
//           else if ( loopMap == 8 ) { playerX -= $gameMap.width(); playerY -= $gameMap.height(); }

//           if ( Collider.intersect( x, y, this.collider(), playerX, playerY, $gamePlayer.collider() ) ) {
//             this.start();
//           }
//         }
//       };

//       Game_Player.prototype.checkEventTriggerHere = function( triggers ) {
//         if ( this.canStartLocalEvents() ) {
//           var collider = this.collider();
//           var bboxTests = $gameMap.getAABBoxTests( this );
//           var player = this;

//           var vx = Direction.isLeft( this._direction ) ? -this.stepDistance : ( Direction.isRight( this._direction ) ? this.stepDistance : 0 );
//           var vy = Direction.isUp( this._direction ) ? -this.stepDistance : ( Direction.isDown( this._direction ) ? this.stepDistance : 0 );

//           // Gather any solid characters within the "here" bounding box
//           var loopMap = {};
//           var events = $gameMap.events().filter( function( event ) {
//             for ( var ii = 0; ii < bboxTests.length; ii++ ) {
//               if ( event.isTriggerIn( triggers ) ) {
//                 if ( event.isNormalPriority() ) {
//                   if ( Collider.aabboxCheck( bboxTests[ii].x + vx, bboxTests[ii].y + vy, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
//                     loopMap[event] = bboxTests[ii].type;
//                     return true;
//                   }
//                 } else {
//                   if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
//                     loopMap[event] = bboxTests[ii].type;
//                     return true;
//                   }
//                 }
//               }
//             }
//             return false;
//           } );

//           // Test collision with characters
//           for ( var ii = 0; ii < events.length; ii++ ) {
//             var entryX = events[ii]._x;
//             var entryY = events[ii]._y;

//             if ( loopMap[events[ii]] == 1 ) { entryX += $gameMap.width(); }
//             else if ( loopMap[events[ii]] == 2 ) { entryX -= $gameMap.width(); }
//             else if ( loopMap[events[ii]] == 3 ) { entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 4 ) { entryY -= $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 5 ) { entryX += $gameMap.width(); entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 6 ) { entryX -= $gameMap.width(); entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 7 ) { entryX += $gameMap.width(); entryY -= $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 8 ) { entryX -= $gameMap.width(); entryY -= $gameMap.height(); }

//             if ( events[ii].isNormalPriority() && Collider.intersect( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) ) {
//               // Normal priority player-touch/event-touch
//               events[ii].start();
//             } else if ( events[ii]._trigger === 2 ) {
//               // Event touch is encasing
//               if ( Collider.encase( entryX, entryY, events[ii].collider(), this._x, this._y, collider ) || Collider.encase( this._x, this._y, collider, entryX, entryY, events[ii].collider() ) ) {
//                 events[ii].start();
//               }
//             } else if ( Collider.intersect( this._x, this._y, collider, entryX, entryY, events[ii].collider() ) ) {
//               events[ii].start();
//             }
//           }
//         }
//       };

//       Game_Player.prototype.checkEventTriggerThere = function( triggers ) {
//         if ( this.canStartLocalEvents() ) {
//           var vx = Direction.isLeft( this._direction ) ? -this.actionWidth() : ( Direction.isRight( this._direction ) ? this.actionWidth() : 0 );
//           var vy = Direction.isUp( this._direction ) ? -this.actionHeight() : ( Direction.isDown( this._direction ) ? this.actionHeight() : 0 );

//           var collider = this.collider();
//           var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );
//           var player = this;

//           // Gather any solid characters within the "there" bounding box
//           var loopMap = {};
//           var events = $gameMap.events().filter( function( event ) {
//             for ( var ii = 0; ii < bboxTests.length; ii++ ) {
//               if ( event.isTriggerIn( triggers ) && event.isNormalPriority() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
//                 loopMap[event] = bboxTests[ii].type;
//                 return true;
//               }
//             }
//             return false;
//           } );

//           // Test collision with characters
//           for ( var ii = 0; ii < events.length; ii++ ) {
//             var entryX = events[ii]._x;
//             var entryY = events[ii]._y;

//             if ( loopMap[events[ii]] == 1 ) { entryX += $gameMap.width(); }
//             else if ( loopMap[events[ii]] == 2 ) { entryX -= $gameMap.width(); }
//             else if ( loopMap[events[ii]] == 3 ) { entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 4 ) { entryY -= $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 5 ) { entryX += $gameMap.width(); entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 6 ) { entryX -= $gameMap.width(); entryY += $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 7 ) { entryX += $gameMap.width(); entryY -= $gameMap.height(); }
//             else if ( loopMap[events[ii]] == 8 ) { entryX -= $gameMap.width(); entryY -= $gameMap.height(); }

//             if ( events[ii]._trigger === 2 ) {
//               // Event touch is encasing
//               if ( Collider.encase( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) || Collider.encase( entryX, entryY, events[ii].collider(), this._x + vx, this._y + vy, collider ) ) {
//                 events[ii].start();
//               }
//             } else if ( Collider.intersect( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) ) {
//               events[ii].start();
//             }
//           }

//           if ( !$gameMap.isAnyEventStarting() ) {
//             // Check for counters
//             var events = [];
//             var tiles = $gameMap.getTilesUnder( this, vx, vy );
//             for ( var ii = 0; ii < tiles.length; ii++ ) {
//               if ( $gameMap.isCounter( tiles[ii][0], tiles[ii][1] ) ) {
//                 var x3 = $gameMap.roundXWithDirection( tiles[ii][0], this._direction );
//                 var y3 = $gameMap.roundYWithDirection( tiles[ii][1], this._direction );

//                 // Gather any solid characters within the "over counter" bounding box
//                 events = events.concat( $gameMap.events().filter( function( event ) {
//                   if ( event.isTriggerIn( triggers ) && event.isNormalPriority() && Collider.aabboxCheck( x3, y3, Collider.sharedTile().aabbox, event._x, event._y, event.collider().aabbox ) ) {
//                     return true;
//                   }
//                   return false;
//                 } ) );
//               }
//             }

//             if ( events.length === 0 ) {
//               return;
//             }

//             var closest;
//             var dist = Number.POSITIVE_INFINITY;
//             for ( var ii = 0; ii < events.length; ii++ ) {
//               var entryX = events[ii]._x;
//               var entryY = events[ii]._y;

//               var dx = this._x - entryX;
//               var dy = this._y - entryY;
//               var td = ( dx * dx + dy * dy );
//               if ( td < dist ) {
//                 dist = td;
//                 closest = events[ii];
//               }
//             }

//             closest.start();
//           }
//         }
//       };
// }

// // Game_Map.prototype.eventsXy = function(x, y) {
// //     x=Math.round(x);
// //     y=Math.round(y);
// //     return this.events().filter(function(event) {
// //         return event.pos(x, y);
// //     });
// // };
