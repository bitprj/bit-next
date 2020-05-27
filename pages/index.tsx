import Head from "next/head";
import React from "react";

import Banner from "../components/home/Banner";
import MainView from "../components/home/MainView";
import Tags from "../components/home/Tags";
import styled from 'styled-components';

const StyledTagBox = styled.div`
  background: #E5E5E5;
`

const Home = () => (
  <>
    <Head>
      <title>HOME | NEXT REALWORLD</title>
      <meta
        name="description"
        content="Next.js + SWR codebase containing realworld examples (CRUD, auth, advanced patterns, etc) that adheres to the realworld spec and API"
      />
    </Head>
    <div className="home-page">
      <Banner />
      <div className="container page">
        <div className="row">
          <MainView />
          <div className="col-md-3">
            <div className="sidebar">
              <h6>Tags</h6>
              <Tags />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Home;
