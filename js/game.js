$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  function preload(){
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/ball.gif');
    game.load.image('paddle', 'assets/player.gif');
    game.load.image('block', 'assets/block.gif');
  }

  var blocks,
      walls,
      roof,
      cursors,
      livesText,
      gameStateText,
      shift;

  var player = {
    lives: 3,
    speed: 400
  }

  var ball = {
    vel: 300,
    velAngle: 125,
    bounce: 1.04,
    gravity: 450
  }


  function create(){
    cursors = game.input.keyboard.createCursorKeys();
    shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); 
    createLevel();

    ball.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'star');
    player.sprite = game.add.sprite(game.world.centerX - (64 / 2), game.world.height - 70, 'paddle');

    livesText = game.add.text(30, game.world.height -30, 'Lives: ' + player.lives, {fontSize: '20px', fill: 'red'});
    gameStateText = game.add.text(game.world.centerX, game.world.centerY, '', {fontSize: '40px', fill: 'red'});
    gameStateText.anchor.set(0.5);

    pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseKey.onDown.add(togglePause, this);

    initPhysics();
  }

  function update(){
    movePlayer();
    updateHUD();

    game.physics.arcade.collide(ball.sprite, walls, ballCollision, null, this);
    game.physics.arcade.collide(ball.sprite, roof, ballCollision, null, this);
    game.physics.arcade.collide(ball.sprite, blocks, blockCollision, null, this);
    game.physics.arcade.collide(ball.sprite, player.sprite, playerBallCollision, null, this);

    outOfBounds();
  }

  function render(){
//    game.debug.bodyInfo(ball.sprite, 32, 32);
  }


  function createLevel(){
    game.add.sprite(0, 0, 'sky');
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

    // FIX THIS SHIT
    for (var i = 1; i < 10; i++){
      var block = blocks.create(i * 70, 60, 'block');
      block.body.immovable = true;
    }

    for (var i = 1; i < 10; i++){
      var block = blocks.create(i * 70, 90, 'block');
      block.body.immovable = true;
    }
  }

  function initPhysics(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    walls.enableBody = true;
    blocks.enableBody = true;

    game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);
    ball.sprite.body.bounce.set(ball.bounce);

    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.immovable = true;

    setTimeout(function(){
      game.physics.arcade.velocityFromAngle(startAngle(), ball.vel, ball.sprite.body.velocity);
      ball.sprite.body.gravity.y = ball.gravity;
    }, 2000);
  }

  function updateHUD(){
    livesText.text = 'Lives: ' + player.lives;

    if(blocks.children.length == 0){
      gameStateText.text = 'You Win!';
      ball.sprite.kill();
    }

    if(player.lives == 0){
      gameStateText.text = 'Game Over!';
      ball.sprite.kill();
    }
  }

  function movePlayer(){
    if (cursors.left.isDown && player.sprite.x > game.world.bounds.left){
      player.sprite.body.velocity.x = -player.speed;
      game.physics.arcade.isPaused = false;
      gameStateText.text = '';
    } else if (cursors.right.isDown && (player.sprite.x + player.sprite.width) < game.world.bounds.right){
      player.sprite.body.velocity.x = player.speed;
      game.physics.arcade.isPaused = false;
      gameStateText.text = '';
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
    ballCollision();
    blockObj.destroy();
  }

  function ballCollision(){
    // play a sound or something.
  }

  function playerBallCollision(){
    var ass = (ball.sprite.x + (ball.sprite.width / 2) - player.sprite.x) / player.sprite.width;
    var newVel = Math.sqrt(Math.pow(ball.sprite.body.velocity.x, 2) + Math.pow(ball.sprite.body.velocity.y, 2));
    game.physics.arcade.velocityFromAngle(225 + (ass * 90), newVel, ball.sprite.body.velocity);
  }

  function togglePause(){
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    gameStateText.text = 'Paused.';
  }

  function outOfBounds(){
    if(ball.sprite.y > game.world.height){
      player.lives -= 1;
      resetBall();
    }
  }

  function resetBall(){
    ball.sprite.x = game.world.centerX;
    ball.sprite.y = game.world.centerY;
    game.physics.arcade.velocityFromAngle(ball.velAngle, 0, ball.sprite.body.velocity);

      ball.sprite.body.gravity.y = 0;

    setTimeout(function(){
      game.physics.arcade.velocityFromAngle(startAngle(), 300, ball.sprite.body.velocity);
      ball.sprite.body.gravity.y = 600;
    }, 2000);
  }

  function startAngle(){
    return 67.5 + (Math.random() * 45);
  }
});
