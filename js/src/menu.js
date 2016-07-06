var Menu = function(){};

Menu.prototype = {
  
}






//var startText,
//    menuStage,
//    selectedLevel;

//var cursors,
//    shift,
//    esc,
//    enter;

var menuState = {
  create: function(){
    menuStage = 0;
    bindKeys();
    paintMenu();
    menuMusic();
    getLevels();

  },

  update: function(){
    if(menuStage == 0){
      blinkText(startText, 600);
    } else if(menuStage == 1){
      //dunno yet
    } else if (menuStage == 2){
      blinkText(levelText, 600);
    }
  },
}

function startGame(){
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

function levelSelect(){
  Helpers.flashBg();
  explosion.play();
  menuStage = 2;
  startText.visible = false;

  selectLevelText = game.add.text(game.world.centerX - 50, game.world.centerY + 50, "Select level:", {fontSize: '40px', fill: '#ff5dbd'});
  selectLevelText.anchor.set(0.5, 0);
  selectLevelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  levelText = game.add.text(game.world.centerX + (selectLevelText.width / 2.5), game.world.centerY + 40, selectedLevel + 1, {fontSize: '50px', fill: '#ff5dbd'});
  levelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);


  cursors.right.onDown.add(function(){
    if(selectedLevel < levelData.levels.length - 1){
      selectedLevel = selectedLevel + 1;
      levelText.text = selectedLevel + 1;
      blip.play();
    } else {
      blip2.play();
    }
  });
  cursors.left.onDown.add(function(){
    if(selectedLevel > 0){
      selectedLevel = selectedLevel - 1;
      levelText.text = selectedLevel + 1;
      blip.play();
    } else {
      blip2.play();
    }
  });

  //enter.onDown.addOnce(menuState.start, true);
 // esc.onDown.addOnce(function(){
 //   menuStage = 1;
 // });
  
}

function getLevels(){
  selectedLevel = 0;
  levelData = game.cache.getJSON('levels');
}


