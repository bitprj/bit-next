import React from "react";

import TabList from "./TabList";
import ArticleList from "../article/ArticleList";

const TagView = (props) => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <TabList />
      </div>
      <ArticleList {...props} />
    </div>
  )
};

export default TagView;
