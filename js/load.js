var loadState = function(game){}

loadState.prototype = {
  preload: function(){
    game.load.spritesheet('loader', 'assets/loading.png', 160, 24);

    game.load.image('splashbg', 'assets/splash-bg.jpg');
    game.load.image('bg1', 'assets/balloutbg1.jpg');
    game.load.image('bg2', 'assets/balloutbg2.jpg');
    game.load.image('bg3', 'assets/balloutbg3.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform.png');
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
    game.load.audio('perfect', 'assets/audio/perfect.mp3');
    game.load.audio('play', 'assets/audio/play.wav');
    game.load.audio('tastemyball', 'assets/audio/taste-my-ball.mp3');

    game.load.json('levels', 'levels/lvl.json');


    var loadingText = game.add.text(game.world.centerX, game.world.centerY, "Loading...", {font: "16px Arial", fill: "#ffffff"});
    loadingText.anchor.set(0.5);
  },

  create: function(){
    var loadingBar = game.add.sprite(game.width / 2, game.height / 2.2, 'loader');
    loadingBar.anchor.setTo(0.5, 1);

    var loading = loadingBar.animations.add('loading');
    loadingBar.animations.play('loading', 30, true);

    game.sound.setDecodedCallback('soundtrackMenu', loadComplete, this);
    loadSounds();
    loadAnnouncer();
  }
};

function loadComplete(){
  game.state.start('menu');
}

var music,
    blip,
    blip2,
    explosion,
    godlike,
    combowhore,
    holyshit,
    impressive,
    rampage,
    triplekill,
    unstoppable,
    wickedsick;

function loadSounds(){
  music = game.add.audio('soundtrack');
  blip = game.add.audio('blip');
  blip2 = game.add.audio('blip2');
  explosion = game.add.audio('explosion');
}

function loadAnnouncer(){
  godlike = game.add.audio('godlike');
  holyshit = game.add.audio('holyshit');
  rampage = game.add.audio('rampage');
  combowhore = game.add.audio('combowhore');
  triplekill = game.add.audio('triplekill');
  wickedsick = game.add.audio('wickedsick');
  unstoppable = game.add.audio('unstoppable');
  impressive = game.add.audio('impressive');
  perfect = game.add.audio('perfect');
  play = game.add.audio('play');
  tastemyball = game.add.audio('tastemyball');
}


function audioVol(){
  music.volume = config.musicVol;
  blip.volume = config.sfxVol * 0.5;
  blip2.volume = config.sfxVol * 0.5;
  explosion.volume = config.sfxVol * 0.4;
  godlike.volume = config.sfxVol * 1;
  holyshit.volume = config.sfxVol * 1;
  rampage.volume = config.sfxVol * 1;
  combowhore.volume = config.sfxVol * 1;
  triplekill.volume = config.sfxVol * 1;
  wickedsick.volume = config.sfxVol * 1;
  unstoppable.volume = config.sfxVol * 1;
  impressive.volume = config.sfxVol * 1;
  perfect.volume = config.sfxVol * 1;
  play.volume = config.sfxVol * 1;
}

