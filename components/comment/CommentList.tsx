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
// END ADDED

import CommentInput from "./CommentInput";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

import { CommentType } from "../../lib/types/commentType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Comment, Avatar } from 'antd';


const CommentList = () => {
  var [clickedComment, setClick] = useState( [] );


  // ADDED
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const handleClickReplyTo = (comment) => {

    if (isLoggedIn) {
      
      if (clickedComment.includes(comment.id)) {
        // Code to hide editor Box via 'Reply To' button
        // NOT YET WORKING

        let temp = clickedComment;
        let spot = temp.indexOf(comment.id);
        if (spot > -1) {
          temp.splice(spot, 1);
        }
        setClick(clickedComment = temp);
        
      } else {
        // Code to show editor box via 'Reply To' button
        //console.log("Clicked, to show it", comment.id) // or comment.createdAt
        setClick(clickedComment.concat( comment.id ));
      }


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
    

   return (
      
      comments.map((comment: CommentType) => (
        
        <Comment
          key={comment.id}
          actions= {[
            clickedComment.includes(comment.id) ?
            <span key="comment-nested-reply-to" 
              onClick = {() =>
                handleClickReplyTo(comment)
              }
            >Hide Editor Box</span>
            :
            <span key="comment-nested-reply-to"
              onClick= {() => 
                handleClickReplyTo(comment)
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
                  comment.body + comment.id
                } 
              </p>
              <p>
                {
                  clickedComment.includes(comment.id) ?  
                    
                    <EditorBox 
                      commentId = {comment.id}
                    /> :  null    
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
