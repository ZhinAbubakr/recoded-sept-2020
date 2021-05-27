var profile_error = $("#profile_error");
var profile_firstName = $("#profile_firstName");
var profile_lastName = $("#profile_lastName");
var profilen_birthdate = $("#profile_birthdate");
var profile_bio = $("#profile_bio");
var checkbox_male = $('#gender_male');
var checkbox_female = $('#gender_female');
var gender
var profile_error_message = $("#profile_error_message");
$("input:checkbox").on('click', function() {
  var $box = $(this);
  if ($box.is(":checked")) {
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    $(group).prop("checked", false);
    gender = ($(this).val());

    $box.prop("checked", true); 
  } else {
    $box.prop("checked", false); 
  }
});
$("#save-Button").click((event) => {
  var firstName= profile_firstName.val();
  var lastName= profile_lastName.val();
  var birthdate = profilen_birthdate.val();
  var bio = profile_bio.val();
  profile_error.hide();

Editing_profiles(firstName, lastName, birthdate,bio,gender,function(result){
  if (result.success) {
    document.location = "/users/profile"
  } else {
    profile_error_message.text(result.error_message);
    profile_error.show();
    
  }

});
})
$("#edit_password").click((event) => {
  $("#passwordpageview").css("display", "block");
  $("#editinfo").css("display", "none");
  $("#edit_password").css("color", "#32D89B");
  $("#viewinfoedit").css("color", "#4D6476");
})
$("#viewinfoedit").click((event) => {
  $("#passwordpageview").css("display", "none");
  $("#editinfo").css("display", "flex");
  $("#edit_password").css("color", "#4D6476");
  $("#viewinfoedit").css("color", "#32D89B");

})
