var completeState = {
  create: function(){
    if(player.lives > 0){
      gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "You win", {fontSize: '40px', fill: '#ff5dbd'});
    } else {
      gameStateText = game.add.text(game.world.centerX, game.world.centerY - 50, "You lost", {fontSize: '40px', fill: '#ff5dbd'});
    }
  }
}
