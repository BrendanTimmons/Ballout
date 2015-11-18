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
    console.log(data.data);
    // $("#scores").empty();
    $("#scores").append("<h2>High Scores</h2>");
    for (var i = 0; i < data.data.length; i++) {
      // console.log(data.data[i]);
      $("#scores").append("<p>" + data.data[i].rank + ' - ' + data.data[i].name + ' - ' + data.data[i].value + "</p>" );
    }
  });
};

$(document).ready(function() {
    updateHighScores();
});
