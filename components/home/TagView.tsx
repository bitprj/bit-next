import React from "react";

import ArticleList from "../article/ArticleList";
import TagHeader from "../../components/tag/TagHeader";

const TagView = (props) => {
  return (
    <div className="col-md-9">
      <TagHeader {...props.tag} />
      <ArticleList {...props} />
    </div>
  )
};

export default TagView;
