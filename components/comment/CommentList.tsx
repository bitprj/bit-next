import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";


// ADDED
import { Component } from 'react';
import { useState, useEffect } from 'react';
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

const CommentList = () => {
  const [clickedComment, setClick] = useState(0);


  // ADDED
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const handleClickReplyTo = (comment) => {

    //const [clickedComment, setClick] = useState(0);

    console.log("In HandleClickReplyTo")
    if (isLoggedIn) {
      console.log("ALREADY LOGGED IN, Clicked")

      comment.replyToClicked = true;
      count = count + 1;
      
      if (clickedComment === 1) {
        setClick(0);
      } else {
        setClick(1);
      }
      /*
      var x = document.getElementById("showBox");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
      */
      /*
      return (
        <div>
          <CommentInput />
                
          {recurseComments(comments)}
    
        </div>
      );
      */
     return;


    } else {
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
    //const [clickedComment, setClick] = useState(0);
    
    /*
    for (let aComment of comments) {
      console.log("this is ", aComment.id, "&", aComment.replyToClicked, "*");
    }
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
                //setClick(1)
              } 
              
            >Reply to </span>
            
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
              <p>
                {
                  comment.body
                } 
              </p>
              <p>
              {
                clickedComment === 1 ?  
                  
                  <EditorBox 
                    onChange = {comment.replyToClicked} 
                    commentId = {comment.parentComment.comments}
                  /> :  null
                  
              }
            </p>

            </div>
          }
        >
          
          {
            comment.parentComment.comments.length > 0 ? recurseComments(comment.parentComment.comments) : console.log(comment.id +"is" + comment.replyToClicked)
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

/*
<p>
              {
                  comment.replyToClicked ? 
                  <EditorBox 
                    onChange = {comment.replyToClicked} 
                    commentId = {comment.parentComment.comments}
                  /> : <p>NOT replyToClicked</p>
                 
              }
              </p>
*/