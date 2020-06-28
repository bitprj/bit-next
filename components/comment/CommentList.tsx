import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";


// ADDED
import { Component } from 'react';
import {message, Form, Button, List, Input} from 'antd';
const { TextArea } = Input;
import checkLogin from "../../lib/utils/checkLogin";
import storage from "../../lib/utils/storage";
import EditorBox from "./EditorBox";
//import handleClickReplyTo from "../../pages/article/[pid]"
// END ADDED

import CommentInput from "./CommentInput";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

import { CommentType } from "../../lib/types/commentType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Comment, Avatar } from 'antd';

// ADDED

// END ADDED

var clickedReplyTo = true;
var count = 0;
//var x = document.getElementById("showEditor");

/*
const showEditor {
    display: none;
  }
*/
const CommentList = () => {



  // ADDED
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const handleClickReplyTo = (comment) => {

    console.log("In HandleClickReplyTo")
    if (isLoggedIn) {
      console.log("ALREADY LOGGED IN, Clicked")
      clickedReplyTo = true;

      comment.replyToClicked = true;
      console.log("replyToClicked?" , comment.replyToClicked, "*")
      count = count + 1;
      
      /*
      var x = document.getElementById("showBox");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
      */
      
      return (
        <div>
          <CommentInput />
                
          {recurseComments(comments)}
    
        </div>
      );
      
     return;


    } else {
      console.log("NOT YET LOGGED IN")
      message.info("Please log in to reply", 10)
    }
  }


  // END ADDED


  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const { data, error } = useSWR(
    `${SERVER_BASE_URL}/articles/${pid}/comments`,
    fetcher
  );

  if (!data) {
    return <LoadingSpinner />;
  }

  if (error)
    return (
      <ErrorMessage message="Cannot load comments related to this article..." />
    );

  const { comments } = data;
  
  
  const recurseComments = (comments) => {
    
    
    for (let aComment of comments) {
      //aComment.replyToClicked = false;
      console.log("this is ", aComment.id, "&", aComment.replyToClicked, "*");
      
    }
    /*
    console.log(comments.length, "ok");//, comment.parentComment.comments + "*");

    */

    // END ADDED 

   return (
      
      comments.map((comment: CommentType) => (
        
        <Comment
          key={comment.id}
          actions= {[
             
              
              <span key="comment-nested-reply-to"
              onClick= {() => 
                handleClickReplyTo(comment)
                
              } 
              
              >Reply to</span>

              
            ,

            <div>
            {
                comment.replyToClicked ? 
                  <EditorBox 
                    onChange = {comment.replyToClicked} 
                    commentId = {comment.parentComment.comments}
                  /> : <p>HEYO</p>
              } 
            </div>
            
          ]}

          
          
          author={comment.author.username}
          avatar={
            <Avatar
              src={comment.author.image}
              alt="Han Solo"
            />
          }
          content={
            <div>
              <p>{comment.body} 
              </p>
              
              <p>
              {
                comment.replyToClicked ? 
                  <EditorBox 
                    onChange = {comment.replyToClicked} 
                    commentId = {comment.parentComment.comments}
                  /> : <p>HERE</p>
              } 
              </p>
              
              
            </div>
          }
        >
          
          {
          comment.parentComment.comments.length > 0 ? recurseComments(comment.parentComment.comments) : null
          }
        </Comment>
        
        
      )))
  }

  return (
    <div>
      <CommentInput />
      {recurseComments(comments)}

    </div>
  );
};



export default CommentList;



//style="display:none">

/*
<div id="showBox" >
                <EditorBox commentId = {comment.id} />

              </div>

{comment.replyToClicked ? <EditorBox onChange = {comment.replyToClicked} commentId = {comment.parentComment.comments}/> : null }

              */


/*
             actions= {[
            
              <span key="comment-nested-reply-to"
              onClick= {() => 
                handleClickReplyTo(comment)
              
              } 
              
              >Reply to</span>
  
            ]}

            */