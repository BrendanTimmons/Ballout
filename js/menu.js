var menuState = {
  create: function(){
    game.add.sprite(0,0, 'splashbg');
    var startText = game.add.text(game.world.centerX / 2, game.world.centerY + 50, "Press Enter to start", {fontSize: '40px', fill: '#ff5dbd'});
    startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    enterKey.onDown.addOnce(this.start, this);


    music = game.add.audio('soundtrackMenu');
    music.loop = true;
    music.play();
  },

  start: function(){
    music.stop();
    game.state.start('play');
  }
}
