var playState = {
  init: function(){
    this.player = {
      lives: 3,
      speed: 400,
      name: "NUL"
    }

    this.ball = {
      vel: 300,
      velAngle: 125,
      bounce: 1.02,
      gravity: 400
    }
  },




  //////////////////////////////////////////
  // CREATE                               //
  //////////////////////////////////////////

  create: function(){
    this.createLevel();
    this.createHUD();
    this.initPhysics();
    this.startGame();
    audioVol();

    space.onDown.add(togglePause);
    esc.onDown.addOnce(this.returnToMenu);
  },


  createHUD: function(){
    livesText = game.add.text(game.world.width - 120, game.world.height -40, 'Lives: ' + this.player.lives, {fontSize: '20px', fill: '#ff5dbd'});
    livesText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    pauseText = game.add.text(game.world.centerX, game.world.centerY + 30, "Paused.", {fontSize: '40px', fill: '#ff5dbd'});
    pauseText.anchor.set(0.5);
    pauseText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    pauseText.visible = false;

    gameStateText = game.add.text(game.world.centerX, game.world.centerY + 30, "", {fontSize: '40px', fill: '#ff5dbd'});
    gameStateText.anchor.set(0.5);
    gameStateText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    scoreText = game.add.text(game.world.width - 280, game.world.height -40, 'Score: ' + score, {fontSize: '20px', fill: '#ff5dbd'});
    scoreText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    comboText = game.add.text(game.world.width - 400, game.world.height -40, 'Combo: x' + combo, {fontSize: '20px', fill: '#ff5dbd'});
    comboText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
  },

  createLevel: function(){
    var levelData = game.cache.getJSON('level' + selectedLevel);

    game.add.sprite(0,0, levelData.levelBackground);
    walls = game.add.physicsGroup();

    var wall = walls.create(0, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    wall = walls.create(game.width -20, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    roof = game.add.sprite(0, -10, 'ground');
    roof.scale.setTo(60, 1);
    game.physics.enable(roof, Phaser.Physics.ARCADE);
    roof.body.immovable = true;

    blocks = game.add.physicsGroup();

    levelData.platformData.forEach(function(ele){
      wall = walls.create(ele.x, ele.y, ele.sprite);
      wall.anchor.set(0.5);
      wall.body.immovable = true;
    });

    levelData.blockData.forEach(function(ele){
      var block = blocks.create(ele.x, ele.y, 'block');
      block.body.immovable = true;
    });


    this.ball.sprite = this.add.sprite(game.world.centerX, game.world.centerY + 70, 'star');
    this.player.sprite = this.add.sprite(game.world.centerX - (64 / 2), game.world.height - 70, 'paddle');
  },

  initPhysics: function(){
    walls.enableBody = true;
    blocks.enableBody = true;

    this.game.physics.enable(this.ball.sprite, Phaser.Physics.ARCADE);
    this.ball.sprite.body.bounce.set(this.ball.bounce);

    this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
    this.player.sprite.body.immovable = true;
  },

  startGame: function(){
    music.loop = true;
    music.play();

    var complete = function(){
      play.play();
      gameStateText.text = '';
      playState.game.physics.arcade.velocityFromAngle(startAngle(), playState.ball.vel, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    this.countdown(tick, complete, 3);
  },


  //////////////////////////////////////////
  // UPDATE                               //
  //////////////////////////////////////////

  update: function(){
    this.movePlayer();
    this.updateHUD();
    this.checkCollisions();
    this.outOfBounds();
  },

  movePlayer: function(){
    // THIS COLLISION DETECTION FUCKING SUCKS. FIGURE IT OUT

    if (cursors.left.isDown && (this.player.sprite.x - this.player.sprite.width / 2) > game.world.bounds.left){
      this.player.sprite.body.velocity.x = -this.player.speed;
    } else if (cursors.right.isDown && (this.player.sprite.x + this.player.sprite.width + 30) < game.world.bounds.right){
      this.player.sprite.body.velocity.x = this.player.speed;
    } else {
      this.player.sprite.body.velocity.x = 0;
    }
    if(shift.isDown){
      this.player.speed = 800;
    } else {
      this.player.speed = 400;
    }
  },

  updateHUD: function(){
    livesText.text = 'Lives: ' + this.player.lives;
    scoreText.text = 'Score: ' + score;

    if(blocks.children.length == 0){
      gameStateText.text = 'You Win! \n High Score: ' + score + '\n Press Enter to Restart Level \n Press Esc to Return to Menu';
      gameStateText.x = game.world.centerX;
      this.ball.sprite.kill();

      enter.onDown.addOnce(this.restartLevel);
    }

    if(this.player.lives == 0){
      gameStateText.text = 'Game Over! \n High Score: ' + score + '\n Press Enter to Restart Level \n Press Esc to Return to Menu';
      gameStateText.x = game.world.centerX;
      gameStateText.anchor.set(0.5);
      this.ball.sprite.kill();

      enter.onDown.addOnce(this.restartLevel);
    }
  },

  checkCollisions: function(){
    game.physics.arcade.collide(this.ball.sprite, walls, this.ballWallCollision, null, this);
    game.physics.arcade.collide(this.ball.sprite, roof, this.ballWallCollision, null, this);
    game.physics.arcade.collide(this.ball.sprite, blocks, this.blockCollision, null, this);
    game.physics.arcade.collide(this.ball.sprite, this.player.sprite, this.playerBallCollision, null, this);
  },

  outOfBounds: function(){
    if(this.player.lives && this.ball.sprite.y > game.world.height || this.ball.sprite.x < 0 || this.ball.sprite.x > game.world.width){
      this.player.lives -= 1;
      if(this.player.lives){
        this.resetBall();
      }
    }
  },

  blockCollision: function(ballObj, blockObj){
    blockObj.destroy();
    explosion.play();
    score = score + (20 * combo);
    comboText.text = 'Combo: x' + combo;

    if(combo == 3){
      triplekill.play();
    } else if (combo == 7){
      impressive.play();
    } else if (combo == 12){
      holyshit.play();
    } else if (combo == 18){
      rampage.play();
    } else if (combo == 22){
      wickedsick.play();
    } else if (combo == 28){
      unstoppable.play();
    } else if (combo == 30){
      combowhore.play();
    }

    combo = combo + 1;

    flashBg();
  },

  ballWallCollision: function(){
    blip2.play();
  },

  ballCollision: function(){
    // maybe do something here.
  },

  playerBallCollision: function(){
    var collisionLoc = (this.ball.sprite.x + (this.ball.sprite.width / 2) - this.player.sprite.x) / this.player.sprite.width;
    var newVel = Math.sqrt(Math.pow(this.ball.sprite.body.velocity.x, 2) + Math.pow(this.ball.sprite.body.velocity.y, 2));
    game.physics.arcade.velocityFromAngle(225 + (collisionLoc * 90), newVel, this.ball.sprite.body.velocity);
    blip.play();
    combo = 1;
    comboText.text = 'Combo: x' + combo;
  },

  resetBall: function(){
    this.ball.sprite.x = game.world.centerX;
    this.ball.sprite.y = game.world.centerY + 70;
    game.physics.arcade.velocityFromAngle(this.ball.velAngle, 0, this.ball.sprite.body.velocity);
    this.ball.sprite.body.gravity.y = 0;

    var complete = function(){
      gameStateText.text = '';
      game.physics.arcade.velocityFromAngle(startAngle(), 300, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    this.countdown(tick, complete, 3);
  },

  restartLevel: function(){
    playState.player.lives = 3;
    score = 0;
    combo = 1;

    game.state.restart();
  },

  returnToMenu: function(){
    playState.player.lives = 3;
    score = 0;
    combo = 1;
    music.stop();

    game.state.start('menu');
  },

  countdown: function(tick, complete, counter){
    if (counter > 0){
      tick(counter);
      counter --;
      setTimeout(function(){
        playState.countdown(tick, complete, counter);
      }, 1000);
    } else {
      complete();
    }
  }
}
// end game state


var blocks,
    walls,
    roof,
    livesText,
    gameStateText,
    pauseText,
    score = 0,
    scoreText,
    combo = 1,
    comboText,
    gameStarted = false;

function startAngle(){
  return 67.5 + (Math.random() * 45);
}


function flashBg(){
  $("body").css({
    'backgroundColor':"#4e404f"
  });

  setTimeout(function(){
    $("body").css({
      'backgroundColor':"#3f3440"
    });
  }, 250);
}


function togglePause(){
  pauseText.visible = !pauseText.visible;

  if(game.physics.arcade.isPaused){
    game.physics.arcade.isPaused = false;
  } else {
    game.physics.arcade.isPaused = true;
  }
}

function outOfBounds(){
}

var tick = function(counter){
  gameStateText.text = counter;
}




