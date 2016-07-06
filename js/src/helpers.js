var timer = 0;
var Helpers = {
  flashBg: function(){
    $("body").css({
      'backgroundColor':"#4e404f"
    });

    setTimeout(function(){
      $("body").css({
        'backgroundColor':"#3f3440"
      });
    }, 250);
  },

  centerObjects: function(objects){
    for(var object of objects){
      object.anchor.setTo(0.5);
    }
  },

  blinkText: function(ele, speed){
    timer += game.time.elapsed;
    if(timer >= speed){
      timer -= speed;
      ele.visible = !ele.visible;
    }
  },

  updateHighScores: function(){
    $.get("http://vcs.hhd.com.au:1337/api/scores", function(data){
      $("#game-scores").empty();
      for (var i = 0; i < data.data.length; i++) {
        $("#game-scores").append("<li>" + data.data[i].name + ' - ' + data.data[i].value + "</li>" );
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  var name = document.getElementById("name");
  if(localStorage.playerName){
    name.value = localStorage.playerName;
  }
  name.addEventListener("blur", function(){
    localStorage.playerName = this.value;
  });
});
