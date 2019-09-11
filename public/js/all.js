$(document).ready(function() {
  // Input animation
  if ($(".anim")) {
    $(".anim").on("keyup", function() {
      if ($(this).val() == "") {
        $(this).removeClass("has-value");
      } else {
        $(this).addClass("has-value");
      }
    });
  }

  // Show image name in file field
  if ($('input[type="file"]')) {
    $('input[type="file"]').on("change", function(e) {
      let filename = e.target.files[0].name;
      $(this)
        .next(".custom-file-label")
        .html(filename);
    });
  }

  // Dismiss alert if available
  if ($(".alert")) {
    setTimeout(() => {
      $(".alert").remove();
    }, 4000);
  }

  // Delete student
  if ($(".del-student")) {
    $(".del-student").on("click", function() {
      const id = $(this).attr("data-id");
      $.ajax({
        url: `/students/${id}`,
        type: "DELETE",
        success: function(result) {
          alert("Deleted successfully");
          location.replace("/students");
        }
      });
    });
  }
});
