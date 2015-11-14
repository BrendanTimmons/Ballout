var loadState = {
  preload: function(){
    var loadingText = game.add.text(game.world.centerX, game.world.centerY, "Loading...", {font: "16px Arial", fill: "#ffffff"});
    loadingText.anchor.set(0.5);

    game.load.spritesheet('loader', 'assets/loading.png', 160, 24);

    game.load.image('splashbg', 'assets/splash-bg.jpg');
    game.load.image('bg', 'assets/balloutbg.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/ball.png');
    game.load.image('paddle', 'assets/player.png');
    game.load.image('block', 'assets/block.png');

    game.load.audio('soundtrackMenu', 'assets/audio/trash80-missing-you.mp3');
    game.load.audio('soundtrack', 'assets/audio/trash80-robot-sneakers.mp3');
    game.load.audio('blip', 'assets/audio/blip.wav');
    game.load.audio('blip2', 'assets/audio/blip2.wav');
    game.load.audio('explosion', 'assets/audio/Explosion2.wav');

    game.load.audio('godlike', 'assets/audio/godlike.mp3');
    game.load.audio('combowhore', 'assets/audio/combowhore.mp3');
    game.load.audio('holyshit', 'assets/audio/holyshit.mp3');
    game.load.audio('impressive', 'assets/audio/impressive.mp3');
    game.load.audio('rampage', 'assets/audio/rampage.mp3');
    game.load.audio('triplekill', 'assets/audio/triplekill.mp3');
    game.load.audio('unstoppable', 'assets/audio/unstoppable.mp3');
    game.load.audio('wickedsick', 'assets/audio/wickedsick.mp3');

    game.load.json('level', 'levels/lvl1.json');

  },

  create: function(){
    game.sound.setDecodedCallback('soundtrackMenu', loadComplete, this);

    var loadingBar = game.add.sprite(game.width / 2, game.height / 2.2, 'loader');
    loadingBar.anchor.setTo(0.5, 1);
    var loading = loadingBar.animations.add('loading');
    loadingBar.animations.play('loading', 30, true);
  }
};

function loadComplete(){
  game.state.start('menu');
}
