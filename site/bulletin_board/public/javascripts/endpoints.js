
// Add information in profile

function Editing_profiles(firstName, lastName,birthdate,bio,gender ,callback) {
  var Editing = {
    firstName: firstName,
    lastName: lastName,
    birthdate:birthdate, 
    bio:bio,
    gender:gender
  };

  $.ajax({
      type: "POST",
      url: "/users/Editing_profiles",
      data: JSON.stringify(Editing),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        callback({
          success: true,
          redirect_uri: result.redirect_uri
        });
      },
      error: function(error) {
        callback({
          success: false,
          redirect_uri: null,
          error_message: 'Error '
          
        });
      }
  });
}


// Posts

/**
 * Creates a new Post on the website with the given title and message.
 *
 * The callback takes a single parameter:
 * {
 *   success: boolean,
 *   redirect_uri: string,
 *   error_message: string
 * }
 * redirect_uri will always be defined when success is true.
 * error_message will always be defined when success is false.
 * redirect_uri must only be used when success is true.
 */
function create_post(title, message, callback) {
  var post = {
    title: title,
    message: message
  };

  $.ajax({
      type: "POST",
      url: "/posts/",
      data: JSON.stringify(post),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        callback({
          success: true,
          redirect_uri: result.redirect_uri
        });
      },
      error: function(error) {
        callback({
          success: false,
          redirect_uri: null,
          error_message: error.responseJSON.error_message
        });
      }
  });
}

/**
 * Either upvotes or removes an upvote for the currently logged in user for the
 * Post whose id was passed.
 *
 * There is no callback for this function - the website will assume it was
 * successful.
 */
function upvote(id, state) {
  var vote = {
    upvoted: state
  };

  $.ajax({
      type: "POST",
      url: "/posts/" + id + "/upvotes",
      data: JSON.stringify(vote),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    });
}

// Users

/**
 * Creates a new User on the website with the given username and password.
 *
 * The callback takes a single parameter:
 * {
 *   success: boolean,
 *   redirect_uri: string,
 *   error_message: string
 * }
 * redirect_uri will always be defined when success is true.
 * error_message will always be defined when success is false.
 * redirect_uri must only be used when success is true.
 */
function signup(username, password, callback) {
  var credentials = {
    username: username,
    password: password
  };

  $.ajax({
      type: "POST",
      url: "/users/",
      data: JSON.stringify(credentials),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        callback({
          success: true,
          redirect_uri: result.redirect_uri
        });
      },
      error: function(error) {
        callback({
          success: false,
          redirect_uri: null,
          error_message: error.responseJSON.error_message
        });
      }
  });
}

/**
 * Signs the user into the website with the given username and password.
 *
 * The callback takes a single parameter:
 * {
 *   success: boolean,
 *   redirect_uri: string,
 *   error_message: string
 * }
 * redirect_uri will always be defined when success is true.
 * error_message will always be defined when success is false.
 * redirect_uri must only be used when success is true.
 */
function login(username, password, callback) {
  var credentials = {
    username: username,
    password: password
  };

  $.ajax({
      type: "POST",
      url: "/users/login",
      data: JSON.stringify(credentials),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        callback({
          success: true,
          redirect_uri: result.redirect_uri
        });
      },
      error: function(error) {
        callback({
          success: false,
          redirect_uri: null,
          error_message: error.responseJSON.error_message
        });
      }
  });
}


/* changing password */

function edit_password(new_password, old_password,confirm_password, callback) {
  var user_password = {
    oldPassword: old_password,
    newPassword: new_password,
    confirmPassword : confirm_password
  };
  $.ajax({
      type: "POST",
      url: "/users/edit_password/",
      data: JSON.stringify(user_password),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        callback({
          success: true,
          redirect_uri: result.redirect_uri
        });
      },
      error: function(error) {
        callback({
          success: false,
          redirect_uri: result.redirect_uri,
          error_message: error.responseJSON.error_message
        });
      }
  }
  
  )
  ;
}

function create_comment(commentt,post_id,callback){

  let  comment={
    comment:commentt
  }

  $.ajax({
    type: 'POST',
    url: "/posts/"+post_id+"/comments",
    data: JSON.stringify(comment),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
             callback(data)
     },
    error: function(error){
      callback(error)
    }
  })
}

function remove_comment(comment_id,callback){
  $.ajax({
    type: 'DELETE',
    url: "/posts/comments/"+comment_id,
    success: function() {
      callback()
    },
    error: function(error){
      callback(error)
    }
  })
}


function edit_comment(comment_id,commentMessage,callback){
  let  comment={
       comment:commentMessage
    }
       $.ajax({
       type: 'PUT', 
       url: '/posts/comments/'+comment_id,
       data: JSON.stringify(comment),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       success: function(newComment) {
       callback(newComment)
       },
       error: function(error){
        callback(error)
      }
     })
    }
  
