$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  function preload(){
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
  }

  var blocks,
      walls,
      roof,
      ball = {
        velX: -200,
        velY: 200
      },
      player = {
        lives: 3
      },
      cursors,
      paddleSpeed = 4,
      livesText,
      gameStateText;

  function create(){
    cursors = game.input.keyboard.createCursorKeys();
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    walls = game.add.physicsGroup();
    walls.enableBody = true;

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
    blocks.enableBody = true;

    for (var i = 1; i < 10; i++){
      var block = blocks.create(i * 70, 30, 'block');
      block.body.immovable = true;
    }

    ball.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'star');
    game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);

    player.sprite = game.add.sprite(185, game.world.height - 70, 'dank');
    player.sprite.scale.setTo(2, 0.5);
    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.immovable = true;

    livesText = game.add.text(30, game.world.height -30, 'Lives: ' + player.lives, {fontSize: '20px', fill: 'red'});
    gameStateText = game.add.text(game.world.centerX, game.world.centerY, '', {fontSize: '40px', fill: 'red'});
    gameStateText.anchor.set(0.5);

    pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseKey.onDown.add(togglePause, this);
  }

  function update(){
    movePlayer();
    updateHUD();

    ball.sprite.body.velocity.x = ball.velX;
    ball.sprite.body.velocity.y = ball.velY;

    game.physics.arcade.collide(ball.sprite, walls, wallCollision, null, this);
    game.physics.arcade.collide(ball.sprite, roof, roofCollision, null, this);
    game.physics.arcade.collide(ball.sprite, blocks, blockCollision, null, this);
    game.physics.arcade.collide(ball.sprite, player.sprite, playerBallCollision, null, this);

    outOfBounds();
  }

  function render(){
    game.debug.bodyInfo(ball.sprite, 32, 32);
  }






  function updateHUD(){
    livesText.text = 'Lives: ' + player.lives;

    if(player.lives == 0){
      gameStateText.text = 'Game Over!';
      ball.sprite.kill();
    }
  }

  function movePlayer(){
    if (cursors.left.isDown && player.sprite.x > game.world.bounds.left){
      if(cursors.left.shiftKey){
        player.sprite.x -= paddleSpeed * 2;
        game.physics.arcade.isPaused = false;
      } else {
        player.sprite.x -= paddleSpeed;
        game.physics.arcade.isPaused = false;
      }
    } else if (cursors.right.isDown && (player.sprite.x + player.sprite.width) < game.world.bounds.right){
      if(cursors.right.shiftKey){
        player.sprite.x += paddleSpeed * 2;
        game.physics.arcade.isPaused = false;
      } else {
        player.sprite.x += paddleSpeed;
        game.physics.arcade.isPaused = false;
      }
    }
  }

  function wallCollision(){
    ballCollision();
  }

  function roofCollision(){
    ballCollision();
  }

  function blockCollision(obj1, obj2){
    ballCollision();
    obj2.kill();
  }

  function playerBallCollision(){
    ballCollision();
  }

  function ballCollision(){
    if(ball.sprite.body.touching.up || ball.sprite.body.touching.down){
      ball.velY = -ball.velY;
    } else if (ball.sprite.body.touching.left || ball.sprite.body.touching.right){
      ball.velX = -ball.velX;
    }
  }

  function togglePause(){
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
  }

  function outOfBounds(){
    if(ball.sprite.y > game.world.height){
      player.lives -= 1;
      ball.sprite.x = game.world.centerX;
      ball.sprite.y = game.world.centerY;
    }
  }
});
