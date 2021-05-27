  let $commentInput=$('#comment')
  let $send_comment=$('#send_comment')



  //create comment
$('#post-comment').on('submit',function(e){
    e.preventDefault()
    
   let post_id=$send_comment.attr('data-postId')
   let comment=$commentInput.val()
       
    $commentInput.val('')

    // fun ajax endpoint

    create_comment(comment,post_id,(data)=>{
      $('#display_comments').append(`
   <li class="m-3 d-flex flex-row "> 
   <div class="">
   <p class="m-0 font-weight-bold " style="color: #449989;">${data.user['username'] }</p>
     <div class="px-1 rounded ml-5" style="background:#637987;width:27rem;">
         <p class="comment_message text-break m-0 p-1">${data.comment }</p>
     </div>
        <div class="ml-5">
             <p class="m-0 d-inline" style="color:#637987">
             ${ data.date['value'] } ${ data.date['name'] }</p>
             <p class="d-inline ml-1" style="color:#637987">Reply</p>
        </div>
        
     </div>
     
     <a  data-toggle="collapse" href='#options${data.id}' role="button" aria-expanded="false" aria-controls="options">
       <span class="material-icons" style="color:#637987">
         more_vert
         </span>
     </a>

  <div class=" btn-group-sm btn-group collapse" id='options${data.id}'     role="group" data-id='$<%=post.author %>' style="width: 2rem;">
     <button type="click"  class=" remove_comment p-0" data-id='${data.id }' style="height: 1.7rem; background: rgba(245, 245, 245, 0);">
         <span class="material-icons ">
       delete
       </span></button>
     <button type="click" class=" border-top Edit_comment p-0" data-id='${data.id }' style="height: 1.7rem;background: rgba(245, 245, 245, 0);">
         <span class="material-icons">
       edit
       </span>
       </button>
 </div> 
   
</li>`)
    })

 })

//remove comment
 $('#display_comments').on('click','.remove_comment',function(e){
  e.preventDefault()
  let comment_id=$(this).attr('data-id')
  let $liParent=$(this).closest('li')
  remove_comment(comment_id,()=>{
    $liParent.remove()
  })
     });

//edit comment
$('#display_comments').on('click','.Edit_comment',function(e){
      e.preventDefault()
      let $liParent=$(this).closest('li')
      let $input= $liParent.find(".comment_message")
     
    //  $liParent.find(".comment_message").css( "background", "yellow" )
      let comment_text =$input.text()

//display input box
$input.replaceWith(`<input class='edit_input'style="background:#637987" value='${comment_text}'>`);
let $edit_input=$liParent.find(".edit_input")
let $comment_id=$(this).attr('data-id')

$edit_input.on( "keyup", function( e ) {
   e.preventDefault()

// escape the edit
  if(e.which == 27 ){
    $edit_input.replaceWith(`<p class="comment_message text-break m-0 p-1">${comment_text}</p>`);
 }
// save the edit
   if(e.which == 13){
    let $comment=$edit_input.val()
    edit_comment($comment_id,$comment,(newComment)=>{
      $edit_input.replaceWith(`<p class="comment_message text-break m-0 p-1">${newComment}</p>`);
    })
   }
  })
})
   
