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
