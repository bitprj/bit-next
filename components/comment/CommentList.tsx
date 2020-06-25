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
const Editor = ({onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
  <TextArea rows={4} onChange={onChange} value={value} />
</Form.Item>
<Form.Item>
  <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
    Add Comment
  </Button>
</Form.Item>
  </>
)
// END ADDED

var clickedReplyTo = true;
var count = 0;

const CommentList = () => {

  // ADDED
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser)

  const handleClickReplyTo = (comment) => {
    console.log("In HandleClickReplyTo")
    if (isLoggedIn) {
      console.log("ALREADY LOGGED IN, Clicked")
      clickedReplyTo = true;
      console.log("comment ID", comment.id, "*");
      console.log("replyToClicked?" , comment.replyToClicked, "*")
      comment.replyToClicked = true;
      console.log("replyToClicked?" , comment.replyToClicked, "*")
      count = count + 1;
      return (
        <div>
          <CommentInput />
                
          {recurseComments(comments)}
    
        </div>
      );
      


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
    
    console.log(comments.length, "ok");

    

    // END ADDED 

   return (
   
      comments.map((comment: CommentType) => (
        <Comment
          key={comment.id}
          actions= {[
            
            <span key="comment-nested-reply-to"
            onClick= {() => handleClickReplyTo(comment)}>Reply to HI8</span>
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
              <p>{comment.body + String(count) + String(comment.replyToClicked)}
              </p>
              <EditorBox thisValue = {comment.replyToClicked} />
            </div>
            
            
          }
        >
            
          {comment.parentComment.comments.length > 0 ? recurseComments(comment.parentComment.comments) : null}
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

// ADDED
/*
class App extends React.Component {

}
*/
// END ADDED


export default CommentList;
