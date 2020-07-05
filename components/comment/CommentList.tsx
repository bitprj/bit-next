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
  // clickedComment is the value of the id of the comment that has clicked the Reply To button
  var [clickedComment, setClick] = useState( '' );
  var [submittedReply, setSubmit] = useState( false );

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const getSubmitData = (handleClick) => {
    console.log("Getting Submit data")
    console.log("IT is ", handleClick, "OK")
    setClick( handleClick );
  }

  const handleClickReplyTo = (comment) => {

    if (isLoggedIn) {
      setClick( comment.id );
    } 
    else { // Not Logged In
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
            If the clickedComment has this id, then there is the Editor Box, so hide the Reply To
            Else, the clickedComment does NOT have this id, 
            so show the Reply To option
            */
            
            clickedComment == comment.id ?
            null
            :
            <span key="comment-nested-reply-to"
              onClick= {() => 
                handleClickReplyTo(comment)
              } 
    
            >Reply to </span>,

            /*
            submittedReply == true ?
            clickedComment = '-1'
            :
            null
            */
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
                  If the clickedComment has this id, then show the Editor Box
                  */
                  clickedComment == comment.id ?  
                    <EditorBox 
                      commentId = {comment.id}
                      handleClick = { getSubmitData }
                    /> 
                    :
                    <p>ClickedComment is { clickedComment } ok </p>    
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
