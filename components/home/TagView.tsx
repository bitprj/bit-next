import React from "react";

import ArticleList from "../article/ArticleList";

const TagView = (props) => {
  return (
    <div className="col-md-9">
      <ArticleList {...props} />
    </div>
  )
};

export default TagView;
