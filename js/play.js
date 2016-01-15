var playState = {
  player: {
    lives: 3,
    speed: 400,
    name: "NUL"
  },

  ball: {
    vel: 300,
    velAngle: 125,
    bounce: 1.02,
    gravity: 400
  },

  scorePosted: false,
  blocks: null,
  walls: null,
  roof: null,
  livesText: null,
  mainText: null,
  pauseText: null,
  baseScore: 20,
  score: 0,
  scoreText: null,
  combo: 1,
  comboText: null,



  //////////////////////////////////////////
  // CREATE                               //
  //////////////////////////////////////////

  create: function(){
    playState.createLevel();
    playState.createHUD();
    playState.initPhysics();
    playState.introCinematic();
    audioVol();
    
      console.log(selectedLevel, levelData.levels.length - 1);
    space.onDown.add(playState.togglePause);
    //esc.onDown.addOnce(playState.returnToMenu);
  },


  createHUD: function(){
    playState.livesText = game.add.text(game.world.width - 120, game.world.height -40, 'Lives: ' + playState.player.lives, {fontSize: '20px', fill: '#ff5dbd'});
    playState.livesText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    playState.pauseText = game.add.text(game.world.centerX, game.world.centerY + 30, "Paused.", {fontSize: '40px', fill: '#ff5dbd'});
    playState.pauseText.anchor.set(0.5);
    playState.pauseText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    playState.pauseText.visible = false;

    playState.mainText = game.add.text(game.world.centerX, game.world.centerY + 30, "", {fontSize: '40px', fill: '#ff5dbd'});
    playState.mainText.anchor.set(0.5);
    playState.mainText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    playState.scoreText = game.add.text(game.world.width - 280, game.world.height -40, 'Score: ' + playState.score, {fontSize: '20px', fill: '#ff5dbd'});
    playState.scoreText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    playState.comboText = game.add.text(game.world.width - 400, game.world.height -40, 'Combo: x' + playState.combo, {fontSize: '20px', fill: '#ff5dbd'});
    playState.comboText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
  },

  createLevel: function(){
    var level = levelData.levels[selectedLevel];

    game.add.sprite(0,0, level.levelBackground);
    playState.walls = game.add.physicsGroup();



    var wall = playState.walls.create(0, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    wall = playState.walls.create(game.width -20, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    playState.roof = game.add.sprite(0, -10, 'ground');
    playState.roof.scale.setTo(60, 1);
    game.physics.enable(playState.roof, Phaser.Physics.ARCADE);
    playState.roof.body.immovable = true;

    playState.blocks = game.add.physicsGroup();

    level.platformData.forEach(function(ele){
      wall = playState.walls.create(ele.x, ele.y, ele.sprite);
      wall.anchor.set(0.5);
      wall.body.immovable = true;
    });

    level.blockData.forEach(function(ele){
      var block = playState.blocks.create(ele.x, ele.y, 'block');
      block.body.immovable = true;
    });

    playState.ball.sprite = playState.add.sprite(game.world.centerX, game.world.centerY + 70, 'star');
    playState.player.sprite = playState.add.sprite(game.world.centerX - (64 / 2), game.world.height + 70, 'paddle');
  },

  initPhysics: function(){
    playState.walls.enableBody = true;
    playState.blocks.enableBody = true;

    playState.game.physics.enable(playState.ball.sprite, Phaser.Physics.ARCADE);
    playState.ball.sprite.body.bounce.set(playState.ball.bounce);

    playState.game.physics.enable(playState.player.sprite, Phaser.Physics.ARCADE);
    playState.player.sprite.body.immovable = true;
    playState.player.sprite.body.checkCollision.left = false;
    playState.player.sprite.body.checkCollision.right = false;
    playState.player.sprite.body.checkCollision.down = false;
  },

  introCinematic: function(){
    var animShip = game.add.tween(playState.player.sprite).to( { y: game.world.height - 70 }, 2000, "Quart.easeOut", true, 1000);
    animShip.onComplete.add(function(){
      playState.startGame();
    },this);
  },

  startGame: function(){
    music.loop = true;
    music.play();

    var complete = function(){
      play.play();
      playState.mainText.text = '';
      playState.game.physics.arcade.velocityFromAngle(startAngle(), playState.ball.vel, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    playState.countdown(complete, 3);
  },


  //////////////////////////////////////////
  // UPDATE                               //
  //////////////////////////////////////////

  update: function(){
    playState.movePlayer();
    playState.updateHUD();
    playState.checkCollisions();
    playState.outOfBounds();
  },

  movePlayer: function(){
    // THIS COLLISION DETECTION FUCKING SUCKS. FIGURE IT OUT

    if (cursors.left.isDown && (playState.player.sprite.x - playState.player.sprite.width / 2) > game.world.bounds.left){
      playState.player.sprite.body.velocity.x = -playState.player.speed;
    } else if (cursors.right.isDown && (playState.player.sprite.x + playState.player.sprite.width + 30) < game.world.bounds.right){
      playState.player.sprite.body.velocity.x = playState.player.speed;
    } else {
      playState.player.sprite.body.velocity.x = 0;
    }
    if(shift.isDown){
      playState.player.speed = 800;
    } else {
      playState.player.speed = 400;
    }
  },

  updateHUD: function(){
    playState.livesText.text = 'Lives: ' + playState.player.lives;
    playState.scoreText.text = 'Score: ' + playState.score;

    if(playState.blocks.children.length == 0){
      playState.ball.sprite.kill();

      if(selectedLevel == levelData.levels.length - 1){
        // Post the score if we need to
        if (!playState.scorePosted) {
          playState.postScore();
          console.log("Win Score Posted");

          playState.mainText.text = 'You Win! \n High Score: ' + playState.score + '\n refresh your browser to restart';
          playState.mainText.x = game.world.centerX;
          playState.mainText.anchor.set(0.5);
        }
      } else {
        selectedLevel = selectedLevel + 1;
        playState.player.lives = playState.player.lives + 1;
        playState.restartLevel();
      }
    }

    if(playState.player.lives == 0){
      playState.mainText.text = 'Game Over! \n High Score: ' + playState.score + '\n refresh your browser to restart';
      playState.mainText.x = game.world.centerX;
      playState.mainText.anchor.set(0.5);
      playState.ball.sprite.kill();
      // Post the score if we need to
      if (!playState.scorePosted) {
        playState.postScore();
      }
    }
  },

  checkCollisions: function(){
    game.physics.arcade.collide(playState.ball.sprite, playState.walls, playState.ballWallCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.roof, playState.ballWallCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.blocks, playState.blockCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.player.sprite, playState.playerBallCollision, null, playState);
  },

  outOfBounds: function(){
    if(playState.player.lives && playState.ball.sprite.y > game.world.height || playState.ball.sprite.x < 0 || playState.ball.sprite.x > game.world.width){
      playState.player.lives -= 1;
      if(playState.player.lives){
        playState.resetBall();
      }
    }
  },

  blockCollision: function(ballObj, blockObj){
    blockObj.destroy();
    explosion.play();
    playState.score = playState.score + (playState.baseScore * playState.combo);
    playState.comboText.text = 'Combo: x' + playState.combo;

    if(playState.combo == 3){
      triplekill.play();
    } else if (playState.combo == 7){
      impressive.play();
    } else if (playState.combo == 12){
      holyshit.play();
    } else if (playState.combo == 18){
      rampage.play();
    } else if (playState.combo == 22){
      wickedsick.play();
    } else if (playState.combo == 28){
      unstoppable.play();
    } else if (playState.combo == 30){
      combowhore.play();
    }

    playState.combo = playState.combo + 1;

    Helpers.flashBg();
  },

  ballWallCollision: function(){
    blip2.play();
  },

  ballCollision: function(){
    // maybe do something here.
  },

  playerBallCollision: function(){
    var collisionLoc = (playState.ball.sprite.x + (playState.ball.sprite.width / 2) - playState.player.sprite.x) / playState.player.sprite.width;
    var newVel = Math.sqrt(Math.pow(playState.ball.sprite.body.velocity.x, 2) + Math.pow(playState.ball.sprite.body.velocity.y, 2));
    game.physics.arcade.velocityFromAngle(225 + (collisionLoc * 90), newVel, playState.ball.sprite.body.velocity);
    blip.play();
    playState.combo = 1;
    playState.comboText.text = 'Combo: x' + playState.combo;
  },

  resetBall: function(){
    playState.ball.sprite.x = game.world.centerX;
    playState.ball.sprite.y = game.world.centerY + 70;
    game.physics.arcade.velocityFromAngle(playState.ball.velAngle, 0, playState.ball.sprite.body.velocity);
    playState.ball.sprite.body.gravity.y = 0;

    var complete = function(){
      playState.mainText.text = '';
      game.physics.arcade.velocityFromAngle(startAngle(), 300, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    playState.countdown(complete, 3);
  },

  reset: function(){
    playState.scorePosted = false;
    playState.combo = 1;
  },

  restartLevel: function(){
    playState.reset();

    game.state.restart();
  },

  returnToMenu: function(){
    playState.reset();
    music.stop();

    game.state.start('menu');
  },

  countdown: function(complete, counter){
    if (counter > 0){
      playState.mainText.text = counter;
      counter --;
      setTimeout(function(){
        playState.countdown(complete, counter);
      }, 1000);
    } else {
      complete();
    }
  },

  togglePause: function(){
    playState.pauseText.visible = !playState.pauseText.visible;

    if(game.physics.arcade.isPaused){
      game.physics.arcade.isPaused = false;
    } else {
      game.physics.arcade.isPaused = true;
    }
  },

  postScore: function(){
    playState.scorePosted = true;
    player_name = $("#name").val();
    $.post("http://vcs.hhd.com.au:1337/api/scores", {score: {name: player_name, value: playState.score}}, function(){
      Helpers.updateHighScores();
    });
  }
}
// end game state

document.addEventListener("DOMContentLoaded", function(event) { 
  var name = document.getElementById("name");
  if(localStorage.playerName){
    name.value = localStorage.playerName;
  }
  name.addEventListener("blur", function(){
    localStorage.playerName = this.value;
  });
});

function startAngle(){
  return 67.5 + (Math.random() * 45);
}
