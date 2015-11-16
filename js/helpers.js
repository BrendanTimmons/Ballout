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
  }
}
