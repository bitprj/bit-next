import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import styled from 'styled-components';
import Twemoji from 'react-twemoji';
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import TagAPI from "../../lib/api/tag"

import TagView from "../../components/home/TagView";
import Tags from "../../components/tag/Tags";
import { Affix } from 'antd';

const StyledEmoji = styled(Twemoji)`
  .emoji {
    width: 20px;
    height: 20px;
  }
`;

const StyledSpan = styled.span`
  font-size: 15px;
  font-weight: bold;
  line-height: 20px;
  color: #000000;
`;

const StyledTagTitle = styled.div`
  padding-bottom: 1.5em;
`;

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

const TagPage = (id) => {
	const router = useRouter();

	const {
		query: { pid },
	} = router

	const {
		data: fetchedArticles,
	} = useSWR(
		`${SERVER_BASE_URL}/articles/?tag=${encodeURIComponent(String(id.id))}`,
		fetcher
	);

	const [top] = useState(10);

	const [tags, setTags] = React.useState(JSON.parse("[{}]"))
	const getTags = async (currentUser) => {
		if (id != null) {
			const { data: initialTag } = await TagAPI.get(id.id);
			setTags(initialTag)
		}
	}

	React.useEffect(() => {
		let user = JSON.parse(localStorage.getItem("user"))
		getTags(user)
	}, [id]);

	const tag = tags;
	if (tag.tag != null) {
		return (
			<>
				<Head>
					<title>{tag.tag.tagname}</title>
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
							<TagView {...fetchedArticles} {...tag} />
						</div>
					</div>
				</div>
			</>
		)
	}
	else {
		return (
			<div></div>
		)
	}
}
TagPage.getInitialProps = async ({ query: { pid } }) => {
	let id = pid
	return { id };
};


export default TagPage;
