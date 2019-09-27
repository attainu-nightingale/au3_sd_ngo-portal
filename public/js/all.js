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

  // Delete profilr
  if ($(".rem-profile")) {
    $(".rem-profile").on("click", function() {
      const id = $(this).attr("data-id");
      const route = $(this).attr("data-route");

      if (confirm("Are you sure you want to delete")) {
        if (route === "vol") {
          $.ajax({
            url: `/vol/profile/${id}`,
            type: "DELETE",
            success: function(result) {
              alert("Deleted successfully");
              location.replace("/logout");

              setTimeout(() => {
                location.reload();
              }, 30000);
            }
          });
        }

        if (route === "user") {
          $.ajax({
            url: `/user/profile/${id}`,
            type: "DELETE",
            success: function(result) {
              alert("Deleted successfully");
              location.replace("/");
            }
          });
        }
      }
    });
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

  // update form
  if ($(".update-form")) {
    $(".update-form").submit(function(event) {
      event.preventDefault();
      const values = $(this).serializeArray();
      const updatedForm = {};
      values.forEach(element => {
        updatedForm[element.name] = element.value;
      });

      const id = $(".student-up").attr("data-id");

      $.ajax({
        url: `/students/edit/${id}`,
        type: "PUT",
        data: JSON.stringify(updatedForm),
        contentType: "application/json",
        success: function(result) {
          alert("successfully updated");
          location.replace("/students");
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  }

  // update form for activity
  if ($(".update-activity")) {
    $(".update-activity").submit(function(event) {
      event.preventDefault();
      const values = $(this).serializeArray();
      const updatedForm = {};
      values.forEach(element => {
        updatedForm[element.name] = element.value;
      });

      const id = $(".act-update").attr("data-id");

      $.ajax({
        url: `/activites/${id}`,
        type: "PUT",
        data: JSON.stringify(updatedForm),
        contentType: "application/json",
        success: function(result) {
          alert("successfully updated");
          location.replace("/activites");
        },
        error: function(err) {
          alert(err);
        }
      });
    });
  }
  // Report form
  if ($(".add-report")) {
    $(".add-report").submit(function(event) {
      event.preventDefault();

      const report = $(".add-report textarea").val();

      const id = $(".add-report-btn").attr("data-id");

      $.ajax({
        url: `/students/edit/${id}`,
        type: "PUT",
        data: JSON.stringify({ report }),
        contentType: "application/json",
        success: function(result) {
          alert("successfully Added");
          location.replace("/students");
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  }

  // Delete actibity
  if ($(".delete-act")) {
    $(".delete-act").on("click", function() {
      const id = $(this).attr("data-id");
      $.ajax({
        url: `/activites/${id}`,
        type: "DELETE",
        success: function(result) {
          alert("Deleted successfully");
          location.reload();
        },
        error: function(error) {
          alert("An error occured");
        }
      });
    });
  }

  // Reset password
  if ($(".reset-pass-form")) {
    $(".reset-pass-form").submit(function(event) {
      event.preventDefault();
      const values = $(this).serializeArray();
      const updatedForm = {};
      values.forEach(element => {
        updatedForm[element.name] = element.value;
      });

      const username = $(".reset-password").attr("data-id");
      const { password, confPassword } = updatedForm;
      if (password !== confPassword) {
        alert("Password doesn't match");
        return;
      }

      $.ajax({
        url: `/reset-pass/${username}`,
        type: "PUT",
        data: JSON.stringify(updatedForm),
        contentType: "application/json",
        success: function(result) {
          if (result.errorMessage) {
            alert(result.errorMessage);
            return;
          }

          alert(result.msg);
          location.replace("/reset-pass/verify");
        },
        error: function(err) {
          console.log(err);
          alert(err);
        }
      });
    });
  }
});
