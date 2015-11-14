var startText,
    timer = 0;

var menuState = {
  create: function(){
    game.add.sprite(0,0, 'splashbg');
    startText = game.add.text(game.world.centerX / 2, game.world.centerY + 50, "Press Enter to start", {fontSize: '40px', fill: '#ff5dbd'});
    startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);


    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.start, this);


    music = game.add.audio('soundtrackMenu');
    music.loop = true;
    music.play();
  },

  update: function(){
    timer += game.time.elapsed;
    if(timer >= 600){
      timer -= 600;
      startText.visible = !startText.visible;
    }

  },

  start: function(){
    music.stop();
    game.state.start('play');
  }
}
