import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import styled from 'styled-components';
import Twemoji from 'react-twemoji';
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";

import TagView from "../../components/home/TagView";
import Tags from "../../components/home/Tags";
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

const TagPage = () => {
    const router = useRouter();
    const {
      query: { pid },
    } = router;
    
    const {
      data: fetchedArticles,
    } = useSWR(
      `${SERVER_BASE_URL}/articles/?tag=${encodeURIComponent(String(pid))}`,
      fetcher
    );
  
    const [top] = useState(10);

    return (
        <>
            <Head>
                {/* <title>{tag.tagname}</title> */}
                <meta
                    name="description"
                    content="Next.js + SWR codebase containing realworld examples (CRUD, auth, advanced patterns, etc) that adheres to the realworld spec and API"
                />
            </Head>
            <div className="home-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-3">
                            <Affix offsetTop={top}>
                                <StyledTagTitle>
                                    <Twemoji options={{ className: 'twemoji' }}>
                                        <StyledEmoji>🏷️<StyledSpan> Tags</StyledSpan></StyledEmoji>
                                    </Twemoji>
                                </StyledTagTitle>
                                <Tags />
                            </Affix>
                        </div>
                        <TagView {...fetchedArticles} />
                    </div>
                </div>
            </div>
        </>
    )
};

export default TagPage;
