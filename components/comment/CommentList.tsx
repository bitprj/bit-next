import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { useState } from 'react';
import { message } from 'antd';
import checkLogin from "../../lib/utils/checkLogin";
import storage from "../../lib/utils/storage";
import EditorBox from "./EditorBox";

import CommentInput from "./CommentInput";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

import { CommentType } from "../../lib/types/commentType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Comment, Avatar } from 'antd';


const CommentList = () => {
  // clickedComment is an array to store the ids of the comments that have clicked the Reply To button
  // These comments will have the Editor Box and Hide Box button available
  var [clickedComment, setClick] = useState( [] );

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const handleClickReplyTo = (comment) => {

    if (isLoggedIn) {
      
      if (clickedComment.includes(comment.id)) {
        // Code to hide editor Box via 'Hide Editor' button
        // NOTE: There is a lag in closing the Editor Box
    
        let temp = clickedComment;
        let spot = temp.indexOf(comment.id);
        if (spot > -1) {
          temp.splice(spot, 1);
        }
        setClick(temp);
        
      } else {
        // Code to show editor box via 'Reply To' button
        setClick(clickedComment.concat( comment.id ));
      }


    } else { // Not Logged In
      message.info("Please log in to reply", 10)
    }
  }

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
            /*
            If the clickedComment array contains this id, then the Editor Box is currently visible
            so offer option to Hide Editor
            Else, the clickedComment array does NOT contain this id, 
            so offer option to Reply To 
            */
            clickedComment.includes(comment.id) ?
            <span key="comment-nested-reply-to" 
              onClick = {() =>
                handleClickReplyTo(comment)
              }
            >Hide Editor</span>
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
                { comment.body } 
              </p>
              <p>
                {
                  /*
                  If the clickedComment array contains this id, then show the Editor Box
                  */
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
