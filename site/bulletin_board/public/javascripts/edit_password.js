var newPassword = $("#profile_password")
var oldPassword = $("#oldPassword")
var confirmPassword = $("#confirmPassword")
var create_user_error_message = $("#create_user_error_message");
var create_user_error = $("#create_user_error");

$("#save_button").click((event) => {
    if(newPassword.val() == confirmPassword.val())
    
{
    edit_password(newPassword.val(), oldPassword.val(), confirmPassword.val(),function(result){
    if (result.success) {
      document.location = "/";

    } else {
      profile_error_message.text(result.error_message);
      profile_error.show();
    }
  });  
}
else
  {
    create_user_error_message.text("Passwords do not match!");
    create_user_error.show();
  }
  })
  
  



