import React from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectSearchBox } from "react-instantsearch-dom";

import Content from "./content";

//first argument is app ID, second is search-only API key (not write to
//index API key)
const client = algoliasearch("2XCFA4U7CZ", "2554992cc824ec1d9b69c2bd1e5483db");
//algolia index in which to search
const indexName = "BitProject";

const Search = () => {
  return (
    <div className="search-container">
      <InstantSearch indexName={indexName} searchClient={client}>
        <CustomSearchBox />
        <Content />
      </InstantSearch>
    </div>
  );
};

const SearchBox = ({ currentRefinement, refine }) => (
  <form noValidate role="search">
    <input
      type="search"
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
    />
  </form>
);

const CustomSearchBox = connectSearchBox(SearchBox);

export default Search;
