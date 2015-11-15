var playState = {
  create: function(){
    createLevel();
    bindKeys();
    createHUD();
    initPhysics();
    audioVol();
    startGame();
    space.onDown.add(togglePause);
  },

  update: function(){
    movePlayer();
    updateHUD();
    checkCollisions();
    outOfBounds();
  }
}


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

var music,
    blip,
    blip2,
    explosion,
    godlike,
    combowhore,
    holyshit,
    impressive,
    rampage,
    triplekill,
    unstoppable,
    wickedsick;

var player = {
  lives: 3,
  speed: 400,
  name: "NUL"
}

var ball = {
  vel: 300,
  velAngle: 125,
  bounce: 1.02,
  gravity: 400
}



//
// CREATE WORLD
//

function startAngle(){
  return 67.5 + (Math.random() * 45);
}

function createHUD(){
  livesText = game.add.text(game.world.width - 120, game.world.height -40, 'Lives: ' + player.lives, {fontSize: '20px', fill: '#ff5dbd'});
  livesText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  pauseText = game.add.text(game.world.centerX, game.world.centerY - 50, "Paused.", {fontSize: '40px', fill: '#ff5dbd'});
  pauseText.anchor.set(0.5);
  pauseText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
  pauseText.visible = false;

  gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "", {fontSize: '40px', fill: '#ff5dbd'});
  gameStateText.anchor.set(0.5);
  gameStateText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  scoreText = game.add.text(game.world.width - 280, game.world.height -40, 'Score: ' + score, {fontSize: '20px', fill: '#ff5dbd'});
  scoreText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  comboText = game.add.text(game.world.width - 400, game.world.height -40, 'Combo: x' + combo, {fontSize: '20px', fill: '#ff5dbd'});
  comboText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
}


function createLevel(){
  game.add.sprite(0,0, 'bg');
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

  var levelData = game.cache.getJSON('level' + selectedLevel);

  levelData.platformData.forEach(function(ele){
    wall = walls.create(ele.x, ele.y, ele.sprite);
    wall.anchor.set(0.5);
    wall.body.immovable = true;
  });

  levelData.blockData.forEach(function(ele){
    var block = blocks.create(ele.x, ele.y, 'block');
    block.body.immovable = true;
  });


  ball.sprite = game.add.sprite(game.world.centerX, game.world.centerY + 70, 'star');
  player.sprite = game.add.sprite(game.world.centerX - (64 / 2), game.world.height - 70, 'paddle');
}

function initPhysics(){
  walls.enableBody = true;
  blocks.enableBody = true;

  game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);
  ball.sprite.body.bounce.set(ball.bounce);

  game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
  player.sprite.body.immovable = true;
}





//
// GAMEPLAY UPDATES
//

function checkCollisions(){
  game.physics.arcade.collide(ball.sprite, walls, ballWallCollision, null, this);
  game.physics.arcade.collide(ball.sprite, roof, ballWallCollision, null, this);
  game.physics.arcade.collide(ball.sprite, blocks, blockCollision, null, this);
  game.physics.arcade.collide(ball.sprite, player.sprite, playerBallCollision, null, this);
}

function updateHUD(){
  livesText.text = 'Lives: ' + player.lives;
  scoreText.text = 'Score: ' + score;

  if(blocks.children.length == 0){
    gameStateText.text = 'You Win! \n High Score: ' + score + '\n Press Enter to Restart Level \n Press Esc to Return to Menu';
    gameStateText.x = game.world.centerX;
    ball.sprite.kill();

    enter.onDown.addOnce(restartLevel);
    esc.onDown.addOnce(returnToMenu);
  }

  if(player.lives == 0){
    gameStateText.text = 'Game Over! \n High Score: ' + score + '\n Press Enter to Restart Level \n Press Esc to Return to Menu';
    gameStateText.x = game.world.centerX;
    gameStateText.anchor.set(0.5);
    ball.sprite.kill();

    enter.onDown.addOnce(restartLevel);
    esc.onDown.addOnce(returnToMenu);
  }
}

function movePlayer(){

  // THIS COLLISION DETECTION FUCKING SUCKS. FIGURE IT OUT

  if (cursors.left.isDown && (player.sprite.x - player.sprite.width / 2) > game.world.bounds.left){
    player.sprite.body.velocity.x = -player.speed;
  } else if (cursors.right.isDown && (player.sprite.x + player.sprite.width + 30) < game.world.bounds.right){
    player.sprite.body.velocity.x = player.speed;
  } else {
    player.sprite.body.velocity.x = 0;
  }
  if(shift.isDown){
    player.speed = 800;
  } else {
    player.speed = 400;
  }
}

function blockCollision(ballObj, blockObj){
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

function ballWallCollision(){
  blip2.play();
}

function ballCollision(){
  // maybe do something here.
}

function playerBallCollision(){
  var collisionLoc = (ball.sprite.x + (ball.sprite.width / 2) - player.sprite.x) / player.sprite.width;
  var newVel = Math.sqrt(Math.pow(ball.sprite.body.velocity.x, 2) + Math.pow(ball.sprite.body.velocity.y, 2));
  game.physics.arcade.velocityFromAngle(225 + (collisionLoc * 90), newVel, ball.sprite.body.velocity);
  blip.play();
  combo = 1;
  comboText.text = 'Combo: x' + combo;
}

function togglePause(){
  game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
  pauseText.visible = !pauseText.visible;
}

function outOfBounds(){
  if(player.lives && ball.sprite.y > game.world.height || ball.sprite.x < 0 || ball.sprite.x > game.world.width){
    player.lives -= 1;
    if(player.lives){
      resetBall();
    }
  }
}

var tick = function(counter){
  gameStateText.text = counter;
}

function startGame(){
  music.loop = true;
  music.play();

  var complete = function(){
    play.play();
    gameStateText.text = '';
    game.physics.arcade.velocityFromAngle(startAngle(), ball.vel, ball.sprite.body.velocity);
    ball.sprite.body.gravity.y = ball.gravity;
  };
  countdown(tick, complete, 3);
}

function resetBall(){
  ball.sprite.x = game.world.centerX;
  ball.sprite.y = game.world.centerY + 70;
  game.physics.arcade.velocityFromAngle(ball.velAngle, 0, ball.sprite.body.velocity);
  ball.sprite.body.gravity.y = 0;

  var complete = function(){
    gameStateText.text = '';
    game.physics.arcade.velocityFromAngle(startAngle(), 300, ball.sprite.body.velocity);
    ball.sprite.body.gravity.y = ball.gravity;
  };
  countdown(tick, complete, 3);
}

function countdown(tick, complete, counter){
  if (counter > 0){
    tick(counter);
    counter --;
    setTimeout(function(){
      countdown(tick, complete, counter);
    }, 1000);
  } else {
    complete();
  }
}

function restartLevel(){
  player.lives = 3;
  score = 0;
  combo = 1;

  game.state.restart();
}

function returnToMenu(){
  player.lives = 3;
  score = 0;
  combo = 1;
  music.stop();

  game.state.start('menu');
}
