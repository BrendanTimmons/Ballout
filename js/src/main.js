var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas'), Main = function(){};

Main.prototype = {
  preload: function(){
    game.load.image('loader', 'assets/loading.png', 160, 24);
    game.load.image('splashbg', 'assets/splash-bg.jpg');
  },

  create: function(){
    //game.sound.setDecodedCallback('soundtrackMenu', loadComplete, this);
    //addSounds();
    //addAnnouncer();
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
}

game.state.add('Main', Main);
game.state.start('Main');

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

function addSounds(){
  music = game.add.audio('soundtrack');
  blip = game.add.audio('blip');
  blip2 = game.add.audio('blip2');
  explosion = game.add.audio('explosion');
}

function addAnnouncer(){
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
  godlike.volume = config.sfxVol;
  holyshit.volume = config.sfxVol;
  rampage.volume = config.sfxVol;
  combowhore.volume = config.sfxVol;
  triplekill.volume = config.sfxVol;
  wickedsick.volume = config.sfxVol;
  unstoppable.volume = config.sfxVol;
  impressive.volume = config.sfxVol;
  perfect.volume = config.sfxVol;
  play.volume = config.sfxVol;
}

