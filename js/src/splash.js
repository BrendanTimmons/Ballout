var Splash = function(){};
var cursors,
    shift,
    enter,
    esc,
    space;

Splash.prototype = {
  loadAudio: function(){
    game.load.audio('soundtrackMenu', 'assets/audio/trash80-missing-you.mp3');
    game.load.audio('soundtrack', 'assets/audio/trash80-robot-sneakers.mp3');
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
    game.load.audio('blip', 'assets/audio/blip.wav');
    game.load.audio('blip2', 'assets/audio/blip2.wav');
    game.load.audio('tastemyball', 'assets/audio/taste-my-ball.mp3');
  },
  loadImages: function(){
    game.load.spritesheet('paddle', 'assets/playeranim.png', 64, 28, 9);
    game.load.image('bg1', 'assets/balloutbg1.jpg');
    game.load.image('bg2', 'assets/balloutbg2.jpg');
    game.load.image('bg3', 'assets/balloutbg3.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('star', 'assets/ball.png');
    game.load.image('block', 'assets/block.png');
    game.load.image('powerup', 'assets/block-powerup.png');
  },
  loadFonts: function(){

  },
  init: function(){
    this.loadingBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loader');
  },
  preload: function(){
    Helpers.centerObjects([this.loadingBar]);
    this.load.setPreloadSprite(this.loadingBar);
    this.loadAudio();
    this.loadImages();
    this.loadFonts();
    this.load.json('levels', 'levels/lvl.json');
  },
  create: function(){
    this.paintSplash();
    this.menuMusic();
    this.bindKeys();
    enter.onDown.addOnce(this.loadMenu);
  },
  update: function(){
    Helpers.blinkText(this.startText, 600);
  },
  paintSplash: function(){
    this.splashBg   = game.add.sprite(0,0, 'splashbg');    
    this.startText  = game.add.text(game.world.centerX, game.world.centerY + 50, "Press Enter to start", {fontSize: '40px', fill: '#ff5dbd'});
    this.startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    Helpers.centerObjects([this.startText, this.loadingBar]);
  },
  menuMusic: function(){
    this.menuMusic = game.add.audio('soundtrackMenu');
    this.menuMusic.loop = true;
    this.menuMusic.volume = config.musicVol;
    this.menuMusic.play();
  },
  bindKeys: function(){
    cursors = game.input.keyboard.createCursorKeys();
    shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); 
    enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  loadMenu: function(){
    game.state.add('Menu', Menu);
    game.state.start('Menu');
  }
}
