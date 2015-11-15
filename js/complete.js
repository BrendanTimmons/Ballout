var completeText;

var completeState = {
  create: function(){
    if(player.lives > 0){
      gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "You win", {fontSize: '40px', fill: '#ff5dbd'});
      gameStateText.set.anchor(0.5);
    } else {
      gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "You lost", {fontSize: '40px', fill: '#ff5dbd'});
      gameStateText.anchor.set(0.5);
    }

    completeText = game.add.text(game.world.centerX, game.world.centerY + 150, "Press 'Enter' to replay level", {fontSize: '40px', fill: '#ff5dbd'});
    completeText.anchor.set(0.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.restart, this);
  },

  restart: function(){
    music.stop();

    player.lives = 3;

    game.state.start('menu', true, false);
  }
}

