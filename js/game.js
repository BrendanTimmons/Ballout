$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas', { preload: preload, create: create, update: update, render: render});

  function preload(){
    game.load.image('bg', 'assets/balloutbg.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/ball.png');
    game.load.image('paddle', 'assets/player.png');
    game.load.image('block', 'assets/block.png');
    game.load.audio('soundtrack', 'assets/audio/trash80-robot-sneakers.mp3');
    game.load.audio('blip', 'assets/audio/blip.wav');
    game.load.audio('blip2', 'assets/audio/blip2.wav');
    game.load.audio('explosion', 'assets/audio/Explosion2.wav');
    game.load.json('level', 'levels/lvl1.json');
  }
  
  var blocks,
      walls,
      roof,
      livesText,
      gameStateText,
      score = 0,
      scoreText,
      combo = 1,
      comboText,
      gameStarted = false;

  var cursors,
      shift,
      space,
      esc;

  var music,
      blip,
      blip2,
      explosion

  var player = {
    lives: 3,
    speed: 400
  }

  var ball = {
    vel: 300,
    velAngle: 125,
    bounce: 1.02,
    gravity: 400
  }


  function create(){
    createLevel();
    bindKeys();
    createHUD();
    initPhysics();
    createSounds();
  }

  function update(){
    movePlayer();
    updateHUD();
    checkCollisions();
    outOfBounds();
  }

  function render(){
//    game.debug.bodyInfo(ball.sprite, 32, 32);
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

    gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "Press 'Spacebar' to start.", {fontSize: '40px', fill: '#ff5dbd'});
    gameStateText.anchor.set(0.5);
    gameStateText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    scoreText = game.add.text(game.world.width - 280, game.world.height -40, 'Score: ' + score, {fontSize: '20px', fill: '#ff5dbd'});
    scoreText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    comboText = game.add.text(game.world.width - 400, game.world.height -40, 'Combo: x' + combo, {fontSize: '20px', fill: '#ff5dbd'});
    comboText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
  }

  function bindKeys(){
    cursors = game.input.keyboard.createCursorKeys();
    shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); 

    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(startGame, this);

    esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    esc.onDown.add(togglePause, this);
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


    var levelData = game.cache.getJSON('level');

    levelData.blockData.forEach(function(ele){
      var block = blocks.create(ele.x, ele.y, 'block');
      block.body.immovable = true;
    });


    ball.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'star');
    player.sprite = game.add.sprite(game.world.centerX - (64 / 2), game.world.height - 70, 'paddle');
  }

  function initPhysics(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    walls.enableBody = true;
    blocks.enableBody = true;

    game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);
    ball.sprite.body.bounce.set(ball.bounce);

    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.immovable = true;

  }

  function createSounds(){
    music = game.add.audio('soundtrack');
    blip = game.add.audio('blip');
    blip2 = game.add.audio('blip2');
    explosion = game.add.audio('explosion');
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
      gameStateText.text = 'You Win! \n High Score: ' + score;
      ball.sprite.kill();
    }

    if(player.lives == 0){
      gameStateText.text = 'Game Over! \n High Score: ' + score;
      ball.sprite.kill();
    }
  }

  function movePlayer(){
    if (cursors.left.isDown && player.sprite.x > game.world.bounds.left){
      player.sprite.body.velocity.x = -player.speed;
    } else if (cursors.right.isDown && (player.sprite.x + player.sprite.width) < game.world.bounds.right){
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
    combo = combo + 1;
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
  }

  function outOfBounds(){
    if(ball.sprite.y > game.world.height){
      player.lives -= 1;
      resetBall();
    }
  }

  var tick = function(counter){
    gameStateText.text = counter;
  }

  function startGame(){
    if (!gameStarted){
      gameStarted = true;
        music.play();
      var complete = function(){
        gameStateText.text = '';
        game.physics.arcade.velocityFromAngle(startAngle(), ball.vel, ball.sprite.body.velocity);
        ball.sprite.body.gravity.y = ball.gravity;
      };
      countdown(tick, complete, 3);
    }
  }

  function resetBall(){
    ball.sprite.x = game.world.centerX;
    ball.sprite.y = game.world.centerY;
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
});
