import React from "react";
import { Input } from "antd";
import algoliasearch from "algoliasearch/lite";
import styled from "styled-components";
import { InstantSearch, connectSearchBox } from "react-instantsearch-dom";

import Content from "./content";

const StyledSearch = styled(Input)`
    border-radius: "5px";
    background-color: "#EDEDED";
    height: "38px";
    font-size: "15px";
`

//first argument is app ID, second is search-only API key (not write to
//index API key)
const client = algoliasearch("2XCFA4U7CZ", "2554992cc824ec1d9b69c2bd1e5483db");
//algolia index in which to search
const indexName = "BitProject";

const Search = () => {
  return (
      <InstantSearch indexName={indexName} searchClient={client}>
        <CustomSearchBox />
        {/*<Content />*/}
      </InstantSearch>
  );
};

const SearchBox = ({ currentRefinement, refine }) => (
    <StyledSearch
      type="search"
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
    />
);

const CustomSearchBox = connectSearchBox(SearchBox);

export default Search;
