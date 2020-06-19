import Head from "next/head";
import React, { useState } from "react";

import MainView from "../components/home/MainView";
import Tags from "../components/tag/Tags";
import styled from 'styled-components';
import Twemoji from 'react-twemoji';
import { Affix } from 'antd';

const StyledEmoji = styled(Twemoji)`
  .emoji {
    width: 20px;
    height: 20px;
  }
`

const StyledSpan = styled.span`
  font-size: 15px;
  font-weight: bold;
  line-height: 20px;
  color: #000000;
`

const StyledTagTitle = styled.div`
  padding-bottom: 1.5em;
`

const StickyLeft = styled(Affix)`  
  display: none;
  @media screen and (min-width: 850px) {
      display:block;
      padding: 0 2px;
      display: flex;
      flex-flow: column wrap;
      overflow: hidden;
      z-index: 100;
  }
`;

const Home = () => {
  const [top] = useState(10);

  return (
    <>
      <Head>
        <title>Bit Project</title>
      </Head>
      <div className="home-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-3">
              <StickyLeft offsetTop={top}>
                <StyledTagTitle>
                  <Twemoji options={{ className: 'twemoji' }}>
                    <StyledEmoji>🏷️<StyledSpan> Tags</StyledSpan></StyledEmoji>
                  </Twemoji>
                </StyledTagTitle>
                <Tags />
              </StickyLeft>
            </div>
            <MainView />
          </div>
        </div>
      </div>
    </>
  )
};

export default Home;
