var bootState = {
  preload: function(){
    // Preload loading bar or something here maybe.
  },
  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
}

var updateHighScores = function(){
  $.get("http://vcs.hhd.com.au:4000/api/scores", function(data){
    $("#game-scores").empty();
    for (var i = 0; i < data.data.length; i++) {
      $("#game-scores").append("<li>" + data.data[i].name + ' - ' + data.data[i].value + "</li>" );
    }
  });
};

$(document).ready(function() {
    updateHighScores();
});
