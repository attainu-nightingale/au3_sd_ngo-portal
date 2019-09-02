$(document).ready(function() {
  $("#activity_img").on("change", function(e) {
    let filename = e.target.files[0].name;
    $(this)
      .next(".custom-file-label")
      .html(filename);
  });
});
