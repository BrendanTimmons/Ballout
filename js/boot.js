var bootState = {
  preload: function(){
    // Preload loading bar or something here maybe.
  },
  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);


    game.state.start('load');
  }
}
