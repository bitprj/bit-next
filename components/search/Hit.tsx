import React from "react";
import { Highlight } from "react-instantsearch-dom";

const Hit = ({ hit }) => {
  return (
    <div className="article-title">
      <Highlight
        attribute="title"
        hit={hit}
        tagName="strong"
      />
    </div>
  );
};

export default Hit;
