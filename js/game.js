$(document).ready(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
  }

  var blocks,
      walls,
      ball = {
        velX: -3,
        velY: 3
      },
      player = {
        lives: 3
      },
      cursors,
      paddleSpeed = 4,
      livesText;

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

    ball.sprite = game.add.sprite(350, game.world.height - 130, 'star');
    game.physics.enable(ball.sprite, Phaser.Physics.ARCADE);

    player.sprite = game.add.sprite(300, game.world.height - 70, 'dank');
    game.physics.arcade.enable(player);
    player.sprite.scale.setTo(2, 0.5);

    livesText = game.add.text(30, game.world.height -30, 'Lives: ' + player.lives, {fontSize: '20px', fill: 'red'});
  }

  function update() {
    movePlayer();
    wallCollision();
    ballPlayerCollision();
    livesText.text = 'Lives: ' + player.lives;
    game.physics.arcade.collide(ball.sprite, player.sprite, ass, null, this);

    ball.sprite.y += ball.velY;
    ball.sprite.x += ball.velX;
  }

  function render() {
    game.debug.body(ball.sprite);
  }

  function ass() {
    console.log("collided");
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
    if (ball.sprite.x < 0){
      ball.velX = -ball.velX;
    } else if (ball.sprite.y < 0){
      ball.velY = -ball.velY;
    } else if (ball.sprite.x > game.world.width - ball.sprite.width){
      ball.velX = -ball.velX;
    } else if (ball.sprite.y > game.world.height - ball.sprite.height){
      ball.velY = -ball.velY;
      player.lives -= 1;
    }
  }

  function ballPlayerCollision(){
    if ((ball.sprite.y + ball.sprite.height) >= player.sprite.y
                && ball.sprite.x >= player.sprite.x 
                && ball.sprite.x <= (player.sprite.x + player.sprite.width)
                && ball.velY > 0
                && (ball.sprite.y + ball.sprite.height) < (player.sprite.y + player.sprite.height)){
      ball.velY = -ball.velY;
    }
  }
});
