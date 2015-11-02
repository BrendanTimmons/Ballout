$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

  function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
  }

  var blocks,
      walls,
      ball = {
        velX: -3,
        velY: -3
      },
      player = {},
      cursors,
      paddleSpeed = 4;

  function create() {
    cursors = game.input.keyboard.createCursorKeys();

    game.add.sprite(0, 0, 'sky');

    walls = game.add.group();
    walls.enableBody = true;

    var wall = walls.create(0, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    wall = walls.create(game.width -20, 0, 'ground');
    wall.scale.setTo(0.05, 60);
    wall.body.immovable = true;

    wall = walls.create(0, -10, 'ground');
    wall.scale.setTo(60, 1);
    wall.body.immovable = true;

//    blocks = game.add.group();
//    blocks.enableBody = true;

//    for (var i = 1; i < 10; i++){
//      var block = blocks.create(i * 70, 30, 'block');
//    }

    ball.sprite = game.add.sprite(320, game.world.height - 120, 'star');

    player.sprite = game.add.sprite(300, game.world.height - 70, 'dank');
    game.physics.arcade.enable(player);
    player.sprite.scale.setTo(2, 0.5);
    player.sprite.body.collideWorldBounds = true;
  }

  function update() {
    movePlayer();
    wallCollision();
    ballPlayerCollision();

    ball.sprite.y += ball.velY;
    ball.sprite.x += ball.velX;
  }

  function movePlayer(){
    if (cursors.left.isDown){
      if(cursors.left.shiftKey){
        player.x -= paddleSpeed * 2;
      } else {
        player.x -= paddleSpeed;
      }
    } else if (cursors.right.isDown) {
      if(cursors.right.shiftKey){
        player.x += paddleSpeed * 2;
      } else {
        player.x += paddleSpeed;
      }
    }
  }

  function wallCollision(){
    if (ball.sprite.x < 0){
      ball.velX = -ball.velX;
    } else if (ball.sprite.y < 0){
      ball.velY = -ball.velY;
    } else if (ball.sprite.x > game.world.width - ball.sprite.width){
      ball.velX = -ball.velX;
    } else if (ball.sprite.y > game.world.height - ball.sprite.height){
      ball.velY = -ball.velY;
    }
  }

  function ballPlayerCollision(){
    if ((ball.sprite.y + ball.sprite.height) > player.y
                && ball.sprite.x > player.x 
                && ball.sprite.x < (player.x + player.width)
                && ball.sprite.y + ball.sprite.height < player.y + ball.velY){
      ball.velY = -ball.velY;
    }
  }
});
