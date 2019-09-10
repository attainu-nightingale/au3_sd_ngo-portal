if ($(".anim")) {
  $(".anim").on("keyup", function() {
    if ($(this).val() == "") {
      $(this).removeClass("has-value");
    } else {
      $(this).addClass("has-value");
    }
  });
}
