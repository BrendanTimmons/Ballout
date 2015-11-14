var startText,
    timer = 0;

var cursors,
    shift,
    esc,
    enter;

var config = {
  musicVol: 0.6,
  sfxVol: 1,
}

var menuState = {
  create: function(){
    bindKeys();

    game.add.sprite(0,0, 'splashbg');
    startText = game.add.text(game.world.centerX / 2, game.world.centerY + 50, "Press Enter to start", {fontSize: '40px', fill: '#ff5dbd'});
    startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    enter.onDown.addOnce(this.start, this);

    music = game.add.audio('soundtrackMenu');
    music.loop = true;
    music.volume = config.musicVol;
    music.play();
  },

  update: function(){
    blinkText(startText, 600);
  },

  start: function(){
    music.stop();
    game.state.start('play');
  }
}

function bindKeys(){
  cursors = game.input.keyboard.createCursorKeys();
  shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); 
  enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  esc.onDown.add(togglePause, this);
}

function blinkText(ele, speed){
  timer += game.time.elapsed;
  if(timer >= speed){
    timer -= speed;
    ele.visible = !ele.visible;
  }
}
