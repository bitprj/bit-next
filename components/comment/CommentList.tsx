import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import CommentInput from "./CommentInput";

import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

import { CommentType } from "../../lib/types/commentType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Comment, Avatar, message } from 'antd';
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";


const CommentList = () => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const { data, error } = useSWR(
    `${SERVER_BASE_URL}/articles/${pid}/comments`,
    fetcher
  );
  const [replyTo,setReplyTo] = React.useState("")
  if (!data) {
    return <LoadingSpinner />;
  }

  if (error)
    return (
      <ErrorMessage message="Cannot load comments related to this article..." />
    );
  const { comments } = data;
  const onCommentClick=(id)=>{
    if(!isLoggedIn){
      message.info('Please Sign in')
    }else{
      if(replyTo == ""){
      setReplyTo(id)
      }
      else{
       setReplyTo("")
      }
    }
  }

 
  const recurseComments = (comments) => {
    return (
      comments.map((comment: CommentType) => (
        <Comment
          key={comment.id}
          actions={[<span key="comment-nested-reply-to" onClick = { ()=> {onCommentClick(comment["id"])}}>Reply to</span>]}
          author={comment.author.username}
          avatar={
            <Avatar
              src={comment.author.image}
              alt="Han Solo"
            />
          } 
          content={
            <p>{comment.body}</p>
          }
        >
           { replyTo == comment["id"] ? 
            <CommentInput id = {comment["id"]}  />: null}
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

export default CommentList;
