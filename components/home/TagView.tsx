import React from "react";
import useSWR, { mutate, trigger } from "swr";

import ArticleList from "../article/ArticleList";
import TagHeader from "../../components/tag/TagHeader";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import TagAPI from "../../lib/api/tag";
import { Tag } from "antd";

const TagView = (props) => {
  const handleFollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/tags/${props.tag.slug}/follow`,
      {},
      true
    );
    await TagAPI.follow(props.tag.slug);
   
    trigger(`${SERVER_BASE_URL}/tags/${props.tag.slug}/follow`);
  };

  const handleUnfollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/tags/${props.tag.slug}/follow`,
      true
    );
    await TagAPI.unfollow(props.tag.slug);
    trigger(`${SERVER_BASE_URL}/tags/${props.tag.slug}/follow`);
  };

  return (
    <div className="col-md-9">
      <TagHeader tagData={props.tag} follow={handleFollow} unfollow={handleUnfollow} />
      <ArticleList {...props} />
    </div>
  )
};

export default TagView;
