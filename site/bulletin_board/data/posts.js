var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./data/database.db');
const moment=require('moment')
var posts = {}

/**
 * Retrieve a single post.
 * {
 *   id: number,
 *   title: string,
 *   author: string,
 *   date: string,
 *   liked: boolean,
 *   url: string,
 *   body: string
 * }
 */
posts.retrieve = (id, userId, callback) => {
  var sql = `
    SELECT
      Posts.id AS id,
      Posts.title,
      Author.username AS author,
      Posts.date,
      Posts.body AS body,
      PostUpvotes.post_id IS NOT NULL AS liked,
      '/posts/' + Posts.id AS url
    FROM
      Posts
      INNER JOIN Users AS Author ON Posts.user_id = Author.id
      LEFT OUTER JOIN PostUpvotes ON PostUpvotes.post_id = Posts.id AND PostUpvotes.user_id = ?
    WHERE
      Posts.id = ?
    ORDER BY
      date DESC
  `;
  db.get(sql, [ userId, id ], (err, row) => {
    if (err || !row) {
      callback(null);
      return;
    }
    callback({
      id: row.id,
      title: row.title,
      author: row.author,
      authorid: row.authorid,
      date: row.date,
      liked: row.liked,
      url: "/posts/" + id,
      body: row.body
    });
  });
};


posts.retrieveperuser = (userId, callback) => {
  var sql = `
    SELECT
      Posts.id AS id,
      Posts.title,
      Author.username AS author,
      Author.id AS authorid,
      Posts.date,
      Posts.body AS body,
      PostUpvotes.post_id IS NOT NULL AS liked,
      '/posts/' + Posts.id AS url
    FROM
      Posts
      INNER JOIN Users AS Author ON Posts.user_id = Author.id
      LEFT OUTER JOIN PostUpvotes ON PostUpvotes.post_id = Posts.id AND PostUpvotes.user_id = Author.id
    WHERE
    Author.id = ?
    ORDER BY
      date DESC
  `;
  db.all(sql, [userId ], (err, rows) => {
    if (err) {
      callback([]);
      return;
    }
    callback(rows);
  });
}



posts.post_liked = (userId, callback) => {
  var sql = `
    SELECT
      Posts.id AS id,
      Posts.title,
      Author.username AS author,
      Author.id AS authorid,
      Posts.date,
      Posts.body AS body,
      PostUpvotes.post_id IS NOT NULL AS liked,
      '/posts/' + Posts.id AS url
    FROM
      Posts
      INNER JOIN Users AS Author ON Posts.user_id = Author.id
      INNER JOIN PostUpvotes ON PostUpvotes.post_id = Posts.id AND PostUpvotes.user_id = ?
    WHERE
    liked = 1
    ORDER BY
      date DESC
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      callback([]);
      return;
    }
    callback(rows);
  });
}
/**
 * Retrieves a list of post excerpts for the most recent posts.
 * {
 *   title: string,
 *   author: string,
 *   date: string,
 *   liked: boolean,
 *   url: string,
 *   excerpt: string
 * }
 */
posts.recent = (userId, callback) => {
  var sql = `
  SELECT
  Posts.id AS id,
  Posts.title,
  Author.username AS author,
  Author.id AS authorid,
  Posts.date,
  PostUpvotes.post_id IS NOT NULL AS liked,
  '/posts/' + Posts.id AS url,
  substr(Posts.body, 0, 140) AS excerpt,
  count(c.comment) as countComment
FROM
  Posts
  INNER JOIN Users AS Author ON Posts.user_id = Author.id
  LEFT OUTER JOIN PostUpvotes ON PostUpvotes.post_id = Posts.id AND PostUpvotes.user_id = ?
  LEFT OUTER JOIN comments as c on posts.id==c.post_id GROUP BY posts.id
  ORDER BY
  Posts.id DESC
LIMIT 100
  `;
  db.all(sql, [ userId ], (err, rows) => {
    if (err) {
      callback([]);
      return;
    }
    callback(rows);
  });
};

/**
 * Retrieves a list of post excerpts for the trending posts.
 * {
 *   title: string,
 *   author: string,
 *   date: string,
 *   liked: boolean,
 *   url: string,
 *   excerpt: string
 * }
 */
posts.trending = (userId, callback) => {
  // TODO: Implement trending sort
  var timestamp = Math.round(new Date().getTime() / 1000);
  var secondsPerMinute = 60;
  var minutesPerHour = 60;
  var hoursPerDay = 24;
  var thirtyDaysInSeconds = 30 * hoursPerDay * minutesPerHour * secondsPerMinute;
  var thirtyDaysAgo = timestamp - thirtyDaysInSeconds;
  var sql = `
  SELECT
      Posts.id AS id,
      Posts.title,
      Author.username AS author,
      Author.id AS authorid,
      Posts.date,
      Author.id AS authorid,
      PostUpvotes.post_id IS NOT NULL AS liked,
      '/posts/' + Posts.id AS url,
      substr(Posts.body, 0, 140) AS excerpt,
	  count(c.comment) as countComment
    FROM
      Posts
      INNER JOIN Users AS Author   ON (Posts.user_id = Author.id)
      LEFT OUTER JOIN PostUpvotes ON (PostUpvotes.post_id = Posts.id AND PostUpvotes.user_id = ?)
	  LEFT OUTER JOIN comments as c on posts.id==c.post_id
	 WHERE Posts.timestamp > ?
   GROUP BY posts.id
    ORDER BY
      Posts.votes DESC
    LIMIT 100
  `;
  db.all(sql, [ userId, thirtyDaysAgo ], (err, rows) => {
    if (err) {
      callback([]);
      return;
    }
    callback(rows);
  });
};

/**
 * Creates a new Post with the given title and message.
 *
 * The callback takes a single parameter:
 * {
 *   success: boolean,
 *   post_id: number,
 *   error_message: string
 * }
 * redirect_uri will always be defined when success is true.
 * error_message will always be defined when success is false.
 * redirect_uri must only be used when success is true.
 */
posts.create = (post, user, callback) => {
  var success = true;
  var error_message = "";

  if (post.title.trim().length < 10) {
    error_message = "A post title is required (minimum 10 characters).";
  } else if (post.message.trim().length < 20) {
    error_message = "A post message is required (minimum 20 characters).";
  }

  if (!success) {
    var result = {
      success: false,
      error_message: error_message
    };
    return callback(result);
  }

  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  var date = new Date();
  var sql ='INSERT INTO posts (title, body, date, user_id, timestamp) VALUES (?, ?, ?, ?, ?)'
  var now = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  var timestamp = Math.round(new Date().getTime() / 1000);
  var params =[post.title, post.message, now, user.id, timestamp]
  db.run(sql, params, function (err, result) {
    var success = !err;
    var result = {
      success: success,
      error_message: "An unknown error occurred.",
      post_id: this.lastID,
    };
    return callback(result);
  });
};

/**
 * Either upvotes or removes an upvote for the currently logged in user for the
 * Post being displayed.
 *
 * The callback takes no parameters.
 */
posts.upvote = (id, user, vote, callback) => {
  var success = true;
  var error_message = "";

  if (!success) {
    var result = {
      success: false,
      error_message: error_message
    };
    return callback(result);
  }

  var sql;
  if (vote) {
    sql ='INSERT INTO PostUpvotes (post_id, user_id) VALUES (?, ?)'
  } else {
    sql ='DELETE FROM PostUpvotes WHERE post_id = ? AND user_id = ?'
  }
  var params =[id, user.id]
  db.run(sql, params, function (err, result) {
    if (this.changes != 1) {
      return callback();
    }
    var operator = vote ? "+" : "-";
    sql ='UPDATE Posts SET vote = vote ' + operator + ' 1 WHERE post_id = ?'
    db.run(sql, [id], function (err, result) {
      callback();
    });
  });
};


function maniplateDate(date){
  const now=moment()
   //get date
 const commentDate=moment(date)

 //get diff
 const yearDiff=now.diff(commentDate, 'year')
 const monthDiff=now.diff(commentDate, 'month')
 const daysDiff=now.diff(commentDate, 'days')
 const hourDiff =now.diff(commentDate, 'hour')
 const minuteDiff =now.diff(commentDate, 'minute')
 const secDiff=now.diff(commentDate, 'second')
 
 let duration
 monthDiff<=12 && monthDiff!=0?duration= {value:monthDiff,name:'m'}:
 daysDiff<=31 && daysDiff!=0?duration=  {value:daysDiff,name:'d'}:
 hourDiff<=24 && hourDiff!=0?duration=  {value:hourDiff,name:'h'}:
 minuteDiff<=60 && minuteDiff!=0?duration={value:minuteDiff,name:'min'}:
 secDiff<=60 && secDiff!=0?duration={value:secDiff,name:"s"}:duration={value:'now',name:""}
 
 return duration
 
 }


 //add comment
 posts.addComment = (postId, user,comment, callback) => {
  const sql = "INSERT INTO comments (comment,date,post_id,user_id) VALUES (?,?,?,?);"
  const date=moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  const params=[comment,date,postId,user.id]

    let stmt = db.prepare(sql);
     stmt.run(params, err => {
      if (err) throw err;
              let result = {
                     user:user,
                     id:stmt.lastID,
                     comment:comment,
                     date:maniplateDate(date)
                 };       
      callback(result)
   }) 
   stmt.finalize();

 }


posts.deleteComment=(comment_id,callback)=>{
const sql = "DELETE FROM comments where comment_id=?;"
db.all(sql,[comment_id], (err, comments) => {
if (err) {
  return console.error("error");
}
callback('success')
});
}
//get the comment for each post
posts.getComment=(post_id,callback)=>{

const sql = " SELECT c.comment_id as id,c.comment,c.date ,u.username,c.user_id from comments c  INNER JOIN posts p on c.post_id==p.id INNER JOIN Users u on c.user_id==u.id WHERE c.post_id=?"
db.all(sql,[post_id], (err, comments) => {
 if (err) {
   return console.error("error");
 }
// console.log(comments)
 callback(comments.map(comment=>{comment.date=maniplateDate(comment.date)
                       return comment}))
});
}

posts.editComment=(comment,comment_id,callback)=>{
const sql = " UPDATE comments SET comment=COALESCE(?,comment) WHERE comment_id = ?;"
const params=[comment,comment_id]
db.run(sql,params, (err) => {
 if (err){
 return console.error("error");
 }
 callback(comment)
})
}
module.exports = posts;

