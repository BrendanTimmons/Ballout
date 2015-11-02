$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  function preload(){
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
  }

  var blocks,
      walls,
      roof,
      ball = {
        velX: -100,
        velY: 100
      },
      player = {
        lives: 3
      },
      cursors,
      paddleSpeed = 4,
      livesText;

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

//    blocks = game.add.group();
//    blocks.enableBody = true;

//    for (var i = 1; i < 10; i++){
//      var block = blocks.create(i * 70, 30, 'block');
//    }

    ball.sprite = game.add.sprite(350, game.world.height - 130, 'star');
    game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);
    ball.sprite.body.collideWorldBounds = true;

    player.sprite = game.add.sprite(300, game.world.height - 70, 'dank');
    player.sprite.scale.setTo(2, 0.5);
    game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    player.sprite.body.immovable = true;

    livesText = game.add.text(30, game.world.height -30, 'Lives: ' + player.lives, {fontSize: '20px', fill: 'red'});

  }

  function update(){
    movePlayer();
    livesText.text = 'Lives: ' + player.lives;

    ball.sprite.body.velocity.x = ball.velX;
    ball.sprite.body.velocity.y = ball.velY;

    game.physics.arcade.collide(ball.sprite, walls, wallCollision, null, this);
    game.physics.arcade.collide(ball.sprite, roof, roofCollision, null, this);
    game.physics.arcade.collide(ball.sprite, player.sprite, ballHit, null, this);
  }

  function render(){
    game.debug.body(ball.sprite);
  }

  function collisionHandler(){
    console.log("ass");
  }

  function movePlayer(){
    if (cursors.left.isDown && player.sprite.x > game.world.bounds.left){
      if(cursors.left.shiftKey){
        player.sprite.x -= paddleSpeed * 2;
      } else {
        player.sprite.x -= paddleSpeed;
      }
    } else if (cursors.right.isDown && (player.sprite.x + player.sprite.width) < game.world.bounds.right){
      if(cursors.right.shiftKey){
        player.sprite.x += paddleSpeed * 2;
      } else {
        player.sprite.x += paddleSpeed;
      }
    }
  }

  function wallCollision(){
    ball.velX = -ball.velX;
  }

  function roofCollision(){
    ball.velY = -ball.velY;
  }

  function ballHit(){
    ball.velY = -ball.velY;
  }
});
