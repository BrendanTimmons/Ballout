"use strict";

var timer = 0;
var Helpers = {
  flashBg: function flashBg() {
    $("body").css({
      'backgroundColor': "#4e404f"
    });

    setTimeout(function () {
      $("body").css({
        'backgroundColor': "#3f3440"
      });
    }, 250);
  },

  centerObjects: function centerObjects(objects) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var object = _step.value;

        object.anchor.setTo(0.5);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  },

  blinkText: function blinkText(ele, speed) {
    timer += game.time.elapsed;
    if (timer >= speed) {
      timer -= speed;
      ele.visible = !ele.visible;
    }
  },

  updateHighScores: function updateHighScores() {
    $.get("http://vcs.hhd.com.au:1337/api/scores", function (data) {
      $("#game-scores").empty();
      for (var i = 0; i < data.data.length; i++) {
        $("#game-scores").append("<li>" + data.data[i].name + ' - ' + data.data[i].value + "</li>");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", function (event) {
  var name = document.getElementById("name");
  if (localStorage.playerName) {
    name.value = localStorage.playerName;
  }
  name.addEventListener("blur", function () {
    localStorage.playerName = this.value;
  });
});
'use strict';

var bootState = {
  preload: function preload() {
    // Preload loading bar or something here maybe.
    Helpers.updateHighScores();
  },
  create: function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
};
"use strict";

var config = {
  musicVol: 0.6,
  sfxVol: 1
};
'use strict';

var Menu = function Menu() {};

Menu.prototype = {};

//var startText,
//    menuStage,
//    selectedLevel;

//var cursors,
//    shift,
//    esc,
//    enter;

var menuState = {
  create: function create() {
    menuStage = 0;
    bindKeys();
    paintMenu();
    menuMusic();
    getLevels();
  },

  update: function update() {
    if (menuStage == 0) {
      blinkText(startText, 600);
    } else if (menuStage == 1) {
      //dunno yet
    } else if (menuStage == 2) {
        blinkText(levelText, 600);
      }
  }
};

function startGame() {
  Helpers.flashBg();
  explosion.play();
  setTimeout(function () {
    tastemyball.play();
  }, 300);
  setTimeout(function () {
    game.state.start('play');
    menuMusic.stop();
  }, 2400);
}

function levelSelect() {
  Helpers.flashBg();
  explosion.play();
  menuStage = 2;
  startText.visible = false;

  selectLevelText = game.add.text(game.world.centerX - 50, game.world.centerY + 50, "Select level:", { fontSize: '40px', fill: '#ff5dbd' });
  selectLevelText.anchor.set(0.5, 0);
  selectLevelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  levelText = game.add.text(game.world.centerX + selectLevelText.width / 2.5, game.world.centerY + 40, selectedLevel + 1, { fontSize: '50px', fill: '#ff5dbd' });
  levelText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);

  cursors.right.onDown.add(function () {
    if (selectedLevel < levelData.levels.length - 1) {
      selectedLevel = selectedLevel + 1;
      levelText.text = selectedLevel + 1;
      blip.play();
    } else {
      blip2.play();
    }
  });
  cursors.left.onDown.add(function () {
    if (selectedLevel > 0) {
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

function getLevels() {
  selectedLevel = 0;
  levelData = game.cache.getJSON('levels');
}
'use strict';

var playState = {
  player: {
    lives: 3,
    speed: 400,
    name: "NUL"
  },

  ball: {
    vel: 300,
    velAngle: 125,
    bounce: 1.02,
    gravity: 400
  },

  scorePosted: false,
  blocks: null,
  walls: null,
  roof: null,
  livesText: null,
  mainText: null,
  pauseText: null,
  baseScore: 20,
  score: 0,
  scoreText: null,
  combo: 1,
  comboText: null,

  //////////////////////////////////////////
  // CREATE                               //
  //////////////////////////////////////////

  create: function create() {
    playState.createLevel();
    playState.createHUD();
    playState.initPhysics();
    playState.introCinematic();
    audioVol();

    space.onDown.add(playState.togglePause);
    //esc.onDown.addOnce(playState.returnToMenu);
  },

  createHUD: function createHUD() {
    createLivesText();
    createPauseText();
    createMainText();
    createScoreText();
    createComboText();

    function createLivesText() {
      playState.livesText = game.add.text(game.world.width - 120, game.world.height - 40, 'Lives: ' + playState.player.lives, { fontSize: '20px', fill: '#ff5dbd' });
      playState.livesText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    }
    function createPauseText() {
      playState.pauseText = game.add.text(game.world.centerX, game.world.centerY + 30, "Paused.", { fontSize: '40px', fill: '#ff5dbd' });
      playState.pauseText.anchor.set(0.5);
      playState.pauseText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
      playState.pauseText.visible = false;
    }
    function createMainText() {
      playState.mainText = game.add.text(game.world.centerX, game.world.centerY + 30, "", { fontSize: '40px', fill: '#ff5dbd' });
      playState.mainText.anchor.set(0.5);
      playState.mainText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    }
    function createScoreText() {
      playState.scoreText = game.add.text(game.world.width - 280, game.world.height - 40, 'Score: ' + playState.score, { fontSize: '20px', fill: '#ff5dbd' });
      playState.scoreText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    }
    function createComboText() {
      playState.comboText = game.add.text(game.world.width - 400, game.world.height - 40, 'Combo: x' + playState.combo, { fontSize: '20px', fill: '#ff5dbd' });
      playState.comboText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    }
  },

  createLevel: function createLevel() {
    var level = levelData.levels[selectedLevel];
    game.add.sprite(0, 0, level.levelBackground);
    playState.ball.sprite = playState.add.sprite(game.world.centerX, game.world.centerY + 70, 'star');
    playState.player.sprite = playState.add.sprite(game.world.centerX - 64 / 2, game.world.height + 70, 'paddle');
    playState.player.sprite.animations.add("idle", [0, 1, 2]);
    playState.player.sprite.animations.add("left", [3, 4, 5]);
    playState.player.sprite.animations.add("right", [6, 7, 8]);
    playState.player.sprite.animations.play("idle", 50, true);

    createBounds();
    createPlatforms();
    createBlocks();

    function createBounds() {
      playState.walls = game.add.physicsGroup();
      var wall = playState.walls.create(0, 0, 'ground');
      wall.scale.setTo(0.05, 60);
      wall.body.immovable = true;
      wall = playState.walls.create(game.width - 20, 0, 'ground');
      wall.scale.setTo(0.05, 60);
      wall.body.immovable = true;
      playState.roof = game.add.sprite(0, -10, 'ground');
      playState.roof.scale.setTo(60, 1);
      game.physics.enable(playState.roof, Phaser.Physics.ARCADE);
      playState.roof.body.immovable = true;
    }

    function createPlatforms() {
      level.platformData.forEach(function (ele) {
        wall = playState.walls.create(ele.x, ele.y, ele.sprite);
        wall.anchor.set(0.5);
        wall.body.immovable = true;
      });
    }

    function createBlocks() {
      playState.blocks = game.add.physicsGroup();
      level.blockData.forEach(function (ele) {
        var block = playState.blocks.create(ele.x, ele.y, ele.type);
        block.type = ele.type;
        block.body.immovable = true;
      });
    }
  },

  initPhysics: function initPhysics() {
    playState.walls.enableBody = true;
    playState.blocks.enableBody = true;

    playState.game.physics.enable(playState.ball.sprite, Phaser.Physics.ARCADE);
    playState.ball.sprite.body.bounce.set(playState.ball.bounce);

    playState.game.physics.enable(playState.player.sprite, Phaser.Physics.ARCADE);
    playState.player.sprite.body.immovable = true;
    playState.player.sprite.body.checkCollision.left = false;
    playState.player.sprite.body.checkCollision.right = false;
    playState.player.sprite.body.checkCollision.down = false;
  },

  introCinematic: function introCinematic() {
    music.loop = true;
    music.play();
    var animShipIn = game.add.tween(playState.player.sprite).to({ y: game.world.height - 70 }, 2000, "Quart.easeOut", true, 1000);
    animShipIn.onComplete.add(function () {
      playState.startGame();
    }, this);
  },

  startGame: function startGame() {
    var complete = function complete() {
      play.play();
      playState.mainText.text = '';
      playState.game.physics.arcade.velocityFromAngle(startAngle(), playState.ball.vel, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    playState.countdown(complete, 3);
  },

  //////////////////////////////////////////
  // UPDATE                               //
  //////////////////////////////////////////

  update: function update() {
    playState.movePlayer();
    playState.checkCollisions();
    playState.outOfBounds();
  },

  movePlayer: function movePlayer() {
    // THIS COLLISION DETECTION FUCKING SUCKS. FIGURE IT OUT

    if (cursors.left.isDown && playState.player.sprite.x - playState.player.sprite.width / 2 > game.world.bounds.left) {
      playState.player.sprite.body.velocity.x = -playState.player.speed;
      playState.player.sprite.animations.play("left", 50, true);
    } else if (cursors.right.isDown && playState.player.sprite.x + playState.player.sprite.width + 30 < game.world.bounds.right) {
      playState.player.sprite.body.velocity.x = playState.player.speed;
      playState.player.sprite.animations.play("right", 50, true);
    } else {
      playState.player.sprite.body.velocity.x = 0;
      playState.player.sprite.animations.play("idle", 50, true);
    }
    if (shift.isDown) {
      playState.player.speed = 800;
    } else {
      playState.player.speed = 400;
    }
  },

  checkCollisions: function checkCollisions() {
    game.physics.arcade.collide(playState.ball.sprite, playState.walls, playState.ballWallCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.roof, playState.ballWallCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.blocks, playState.blockCollision, null, playState);
    game.physics.arcade.collide(playState.ball.sprite, playState.player.sprite, playState.playerBallCollision, null, playState);
  },

  outOfBounds: function outOfBounds() {
    if (playState.player.lives && playState.ball.sprite.y > game.world.height || playState.ball.sprite.x < 0 || playState.ball.sprite.x > game.world.width) {
      playState.player.lives -= 1;
      if (playState.player.lives) {
        playState.resetBall();
      } else {
        playState.updateHUD();
      }
    }
  },

  blockCollision: function blockCollision(ballObj, blockObj) {
    blockObj.destroy();
    explosion.play();
    playState.score = playState.score + playState.baseScore * playState.combo;
    playState.comboText.text = 'Combo: x' + playState.combo;
    playState.combo = playState.combo + 1;
    Helpers.flashBg();
    playState.updateHUD();

    if (playState.combo == 3) {
      triplekill.play();
    } else if (playState.combo == 7) {
      impressive.play();
    } else if (playState.combo == 12) {
      holyshit.play();
    } else if (playState.combo == 18) {
      rampage.play();
    } else if (playState.combo == 22) {
      wickedsick.play();
    } else if (playState.combo == 28) {
      unstoppable.play();
    } else if (playState.combo == 30) {
      combowhore.play();
    }
    if (blockObj.type == "powerup") {
      playState.ball.sprite.body.gravity.y = 0;
      setTimeout(function () {
        playState.ball.sprite.body.gravity.y = playState.ball.gravity;
      }, 15000);
    }
  },

  ballWallCollision: function ballWallCollision() {
    blip2.play();
    playState.updateHUD();
  },

  playerBallCollision: function playerBallCollision() {
    var collisionLoc = (playState.ball.sprite.x + playState.ball.sprite.width / 2 - playState.player.sprite.x) / playState.player.sprite.width;
    var newVel = Math.sqrt(Math.pow(playState.ball.sprite.body.velocity.x, 2) + Math.pow(playState.ball.sprite.body.velocity.y, 2));
    game.physics.arcade.velocityFromAngle(225 + collisionLoc * 90, newVel, playState.ball.sprite.body.velocity);
    blip.play();
    playState.combo = 1;
    playState.comboText.text = 'Combo: x' + playState.combo;
    playState.updateHUD();
  },

  updateHUD: function updateHUD() {
    playState.livesText.text = 'Lives: ' + playState.player.lives;
    playState.scoreText.text = 'Score: ' + playState.score;

    if (playState.blocks.children.length == 0) {
      playState.ball.sprite.kill();

      if (selectedLevel == levelData.levels.length - 1) {
        // Post the score if we need to
        if (!playState.scorePosted) {
          playState.postScore();
          console.log("Win Score Posted");

          playState.mainText.text = 'You Win! \n High Score: ' + playState.score + '\n refresh your browser to restart';
          playState.mainText.x = game.world.centerX;
          playState.mainText.anchor.set(0.5);
        }
      } else {
        var animShipOut = game.add.tween(playState.player.sprite).to({ y: -100 }, 3000, "Quart.easeInOut", true, 1000);
        animShipOut.onComplete.add(function () {
          selectedLevel = selectedLevel + 1;
          playState.player.lives = playState.player.lives + 1;
          playState.restartLevel();
        }, this);
      }
    }

    if (!playState.player.lives) {
      playState.mainText.text = 'Game Over! \n High Score: ' + playState.score + '\n refresh your browser to restart';
      playState.mainText.x = game.world.centerX;
      playState.mainText.anchor.set(0.5);
      playState.ball.sprite.kill();
      // Post the score if we need to
      if (!playState.scorePosted) {
        playState.postScore();
      }
    }
  },

  resetBall: function resetBall() {
    playState.ball.sprite.x = game.world.centerX;
    playState.ball.sprite.y = game.world.centerY + 70;
    game.physics.arcade.velocityFromAngle(playState.ball.velAngle, 0, playState.ball.sprite.body.velocity);
    playState.ball.sprite.body.gravity.y = 0;

    var complete = function complete() {
      playState.mainText.text = '';
      game.physics.arcade.velocityFromAngle(startAngle(), 300, playState.ball.sprite.body.velocity);
      playState.ball.sprite.body.gravity.y = playState.ball.gravity;
    };
    playState.countdown(complete, 3);
    playState.updateHUD();
  },

  reset: function reset() {
    playState.scorePosted = false;
    playState.combo = 1;
  },

  restartLevel: function restartLevel() {
    playState.reset();
    game.state.restart();
  },

  returnToMenu: function returnToMenu() {
    playState.reset();
    music.stop();
    game.state.start('menu');
  },

  countdown: function countdown(complete, counter) {
    if (counter > 0) {
      playState.mainText.text = counter;
      counter--;
      setTimeout(function () {
        playState.countdown(complete, counter);
      }, 1000);
    } else {
      complete();
    }
  },

  togglePause: function togglePause() {
    playState.pauseText.visible = !playState.pauseText.visible;
    if (game.physics.arcade.isPaused) {
      game.physics.arcade.isPaused = false;
    } else {
      game.physics.arcade.isPaused = true;
    }
  },

  postScore: function postScore() {
    playState.scorePosted = true;
    player_name = $("#name").val();
    $.post("http://vcs.hhd.com.au:1337/api/scores", { score: { name: player_name, value: playState.score } }, function () {
      Helpers.updateHighScores();
    });
  }
};
// end game state

document.addEventListener("DOMContentLoaded", function (event) {
  var name = document.getElementById("name");
  if (localStorage.playerName) {
    name.value = localStorage.playerName;
  }
  name.addEventListener("blur", function () {
    localStorage.playerName = this.value;
  });
});

function startAngle() {
  return 67.5 + Math.random() * 45;
}
'use strict';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-canvas'),
    Main = function Main() {};

Main.prototype = {
  preload: function preload() {
    game.load.image('loader', 'assets/loading.png', 160, 24);
    game.load.image('splashbg', 'assets/splash-bg.jpg');
  },

  create: function create() {
    //game.sound.setDecodedCallback('soundtrackMenu', loadComplete, this);
    //addSounds();
    //addAnnouncer();
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');

var music, blip, blip2, explosion, godlike, combowhore, holyshit, impressive, rampage, triplekill, unstoppable, wickedsick;

function addSounds() {
  music = game.add.audio('soundtrack');
  blip = game.add.audio('blip');
  blip2 = game.add.audio('blip2');
  explosion = game.add.audio('explosion');
}

function addAnnouncer() {
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

function audioVol() {
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
'use strict';

var Splash = function Splash() {};
var cursors, shift, enter, esc, space;

Splash.prototype = {
  loadAudio: function loadAudio() {
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
  loadImages: function loadImages() {
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
  loadFonts: function loadFonts() {},
  init: function init() {
    this.loadingBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loader');
  },
  preload: function preload() {
    Helpers.centerObjects([this.loadingBar]);
    this.load.setPreloadSprite(this.loadingBar);
    this.loadAudio();
    this.loadImages();
    this.loadFonts();
    this.load.json('levels', 'levels/lvl.json');
  },
  create: function create() {
    this.paintSplash();
    this.menuMusic();
    this.bindKeys();
    enter.onDown.addOnce(this.loadMenu);
  },
  update: function update() {
    Helpers.blinkText(this.startText, 600);
  },
  paintSplash: function paintSplash() {
    this.splashBg = game.add.sprite(0, 0, 'splashbg');
    this.startText = game.add.text(game.world.centerX, game.world.centerY + 50, "Press Enter to start", { fontSize: '40px', fill: '#ff5dbd' });
    this.startText.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
    Helpers.centerObjects([this.startText, this.loadingBar]);
  },
  menuMusic: function menuMusic() {
    this.menuMusic = game.add.audio('soundtrackMenu');
    this.menuMusic.loop = true;
    this.menuMusic.volume = config.musicVol;
    this.menuMusic.play();
  },
  bindKeys: function bindKeys() {
    cursors = game.input.keyboard.createCursorKeys();
    shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  loadMenu: function loadMenu() {
    game.state.add('Menu', Menu);
    game.state.start('Menu');
  }
};
//# sourceMappingURL=all.js.map
