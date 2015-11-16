var startText,
    timer = 0,
    menuStage,
    selectedLevel = 1;

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
    menuStage = 1;

    game.add.sprite(0,0, 'splashbg');
    startText = game.add.text(game.world.centerX, game.world.centerY + 50, "Press Enter to start", {fontSize: '40px', fill: '#ff5dbd'});
    startText.anchor.set(0.5, 0);
    startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

    //enter.onDown.addOnce(this.start, this);
    enter.onDown.addOnce(levelSelect);

    menuMusic = game.add.audio('soundtrackMenu');
    menuMusic.loop = true;
    menuMusic.volume = config.musicVol;
    menuMusic.play();
  },

  update: function(){
    if(menuStage == 1){
      blinkText(startText, 600);
    }
    if(menuStage == 2){
      blinkText(levelText, 600);
    }
  },

  start: function(){
    Helpers.flashBg(); 
    explosion.play();
    setTimeout(function(){
      tastemyball.play();
    }, 300);
    setTimeout(function(){
      game.state.start('play');
      menuMusic.stop();
    }, 2400);
  }
}

function levelSelect(){
  Helpers.flashBg();
  explosion.play();
  menuStage = 2;
  startText.visible = false;

  selectLevelText = game.add.text(game.world.centerX - 50, game.world.centerY + 50, "Select level:", {fontSize: '40px', fill: '#ff5dbd'});
  selectLevelText.anchor.set(0.5, 0);
  selectLevelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  levelText = game.add.text(game.world.centerX + (selectLevelText.width / 2.5), game.world.centerY + 40, selectedLevel, {fontSize: '50px', fill: '#ff5dbd'});
  levelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);


  // IMPROVE THIS LATER
  cursors.right.onDown.add(function(){
    if(selectedLevel < 3){
      selectedLevel = selectedLevel + 1;
      levelText.text = selectedLevel;
      blip.play();
    } else {
      blip2.play();
    }
  });
  cursors.left.onDown.add(function(){
    if(selectedLevel > 1){
      selectedLevel = selectedLevel - 1;
      levelText.text = selectedLevel;
      blip.play();
    } else {
      blip2.play();
    }
  });

  enter.onDown.addOnce(menuState.start, true);
 // esc.onDown.addOnce(function(){
 //   menuStage = 1;
 // });
  
}

function bindKeys(){
  cursors = game.input.keyboard.createCursorKeys();
  shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); 
  enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function blinkText(ele, speed){
  timer += game.time.elapsed;
  if(timer >= speed){
    timer -= speed;
    ele.visible = !ele.visible;
  }
}
