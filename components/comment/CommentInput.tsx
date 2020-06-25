import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { trigger } from "swr";
import {message} from 'antd'

import CustomImage from "../common/CustomImage";
import CustomLink from "../common/CustomLink";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import storage from "../../lib/utils/storage";

const CommentInput = (id=null) => {
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const [content, setContent] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const handleChange = React.useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(id.id == null){
    await axios.post(
      `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}/comments`,
      JSON.stringify({
        comment: {
          body: content,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
        },
      }
    )
    trigger(`${SERVER_BASE_URL}/articles/${pid}/comments`);
  }else{
      await axios.post(
        `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}/comments`,
        JSON.stringify({
          comment: {
            body: content,
            comment_id : id.id
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
          },
        }
      );
      trigger(`${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}/comments`);
      
    };
    setLoading(false);
    setContent("");

  };

  if (!isLoggedIn && id.id == null) {
    return (
      <p>
        <CustomLink href="/user/login" as="/user/login">
          Sign in
        </CustomLink>
        &nbsp;or&nbsp;
        <CustomLink href="/user/register" as="/user/register">
          sign up
        </CustomLink>
        &nbsp;to add comments on this article.
      </p>
    );
  }
  let text = "Post Comment"
  if(id.id != null){
    text = "Reply Comment"
  }
  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea
          rows={3}
          className="form-control"
          placeholder="Write a comment..."
          value={content}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      <div className="card-footer">
        <CustomImage
          className="comment-author-img"
          src={currentUser?.image}
          alt="Comment author's profile image"
        />
        <button className="btn btn-sm btn-primary" type="submit">
          {text}
        </button> 
      </div>
    </form>
  );
};

export default CommentInput;
