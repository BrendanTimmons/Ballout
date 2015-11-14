  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas');

  game.state.add('boot', bootState);
  game.state.add('load', loadState);
  game.state.add('menu', menuState);
  game.state.add('play', playState);
  game.state.add('complete', completeState);

  game.state.start('boot');

