import marked from "marked";
import Router, { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import {Tag, Row, Col, Space} from "antd";
import UserArticle from "../../components/global/UserInfoCard";
import ArticleCard from "../../components/article/UserArticleCard";
import styled from 'styled-components';

import Twemoji from 'react-twemoji';

import ArticleMeta from "../../components/article/ArticleMeta";
import CommentList from "../../components/comment/CommentList";
import ArticleAPI from "../../lib/api/article";
import {Article} from "../../lib/types/articleType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import User from "../../components/global/User";
import axios from "axios";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex:auto;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledEmoji = styled.div`  
  img{
    margin-top: 2em;
    width: 2.5em;
    background-color: white;
    border-radius: 50%;
  }
`;

const BackGround = styled.div`
  background-color: #F5F5F5;
`;

const ArticlePage = (initialArticle) => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const {
    data: fetchedArticle,
  } = useSWR(
      `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}`,
      fetcher,
      { initialData: initialArticle }
  );

  const { article }: Article = fetchedArticle || initialArticle;

  const { data: fetchedArticles } = useSWR(
      `${SERVER_BASE_URL}/articles?author=${article.author.username}`,
      fetcher
  );

  let { articles } = fetchedArticles|| [];
  // console.log('author', article.author);
  // console.log('articles', articles);
  articles = articles ? articles.slice(0, Math.min(articles.length, 5)) : [];

  const [preview, setPreview] = React.useState(article);
  const [hover, setHover] = React.useState(false);
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);

  const handleClickFavorite = async slug =>{
    if (!isLoggedIn) {
      Router.push(`/user/login`);
      return;
    }
    setPreview({
      ...preview,
      favorited: !preview.favorited,
      favoritesCount: preview.favorited
          ? preview.favoritesCount - 1
          : preview.favoritesCount + 1,
    });
    try {
      if (preview.favorited) {
        await axios.delete(`${SERVER_BASE_URL}/articles/${slug}/favorite`, {
          headers: {
            Authorization: `Token ${currentUser?.token}`,
          },
        });
        alert('Removed from favorites')
      } else {
        await axios.post(
            `${SERVER_BASE_URL}/articles/${slug}/favorite`,
            {},
            {
              headers: {
                Authorization: `Token ${currentUser?.token}`,
              },
            }
        );
        alert('Added to favorites');
      }
    } catch (error) {
      setPreview({
        ...preview,
        favorited: !preview.favorited,
        favoritesCount: preview.favorited
            ? preview.favoritesCount - 1
            : preview.favoritesCount + 1,
      });
    }
  };

  const handleClickBookmark = async slug =>{
    if (!isLoggedIn) {
      Router.push(`/user/login`);
      return;
    }
    setPreview({
      ...preview,
      bookmarked: !preview.bookmarked,
      bookmarkCount: preview.bookmarked
          ? preview.bookmarkCount - 1
          : preview.bookmarkCount + 1,
    });
    try {
      if (preview.bookmarked) {
        await axios.delete(`${SERVER_BASE_URL}/articles/${slug}/bookmark`, {
          headers: {
            Authorization: `Token ${currentUser?.token}`,
          },
        });
        alert('Removed from bookmark');
      } else {
        await axios.post(
            `${SERVER_BASE_URL}/articles/${slug}/bookmark`,
            {},
            {
              headers: {
                Authorization: `Token ${currentUser?.token}`,
              },
            }
        );
        alert('Successfully bookmarked');
      }
    } catch (error) {
      console.log(error);
      setPreview({
        ...preview,
        bookmarked: !preview.bookmarked,
        bookmarkCount: preview.bookmarked
            ? preview.bookmarkCount - 1
            : preview.bookmarkCount + 1,
      });
    }
  };

  const staticSrc = 'https://i.ytimg.com/vi/cNEsl9J69OQ/maxresdefault.jpg';

  const markup = {
    __html: marked(article.body, { sanitize: true }),
  };

  return (
    <div className="article-page">
      <BackGround>
          <Row>
            <Col flex = '12%'>
              <CenterWrapper>
                <Twemoji options={{ className: 'twemoji' }}>
                  <StyledEmoji style = {{cursor: 'pointer'}} onClick={() => handleClickFavorite(article.slug)}>
                    {preview.favorited? '💟':"❤️"}
                  </StyledEmoji>
                  <StyledEmoji style = {{cursor: 'pointer'}} onClick={() => handleClickBookmark(article.slug)}>
                    {preview.bookmarked ? '🔖':"🏷"}
                  </StyledEmoji>
                </Twemoji>
              </CenterWrapper>
            </Col>

            <Col flex = '64%' >
              <div>
                <div>
                  <img src = {article.image ? article.image : staticSrc} alt = 'image' style = {styles.imgContainer}/>
                </div>
                <ul className="tag-list">
                  {article.tagList.map((tag) => (
                      <li key={tag.tagname}>
                        <Tag style = {styles.customTag}>
                          #{tag.tagname}
                        </Tag>
                      </li>
                  ))}
                </ul>
                <h1>{article.title}</h1>
                <ArticleMeta article={article} />
              </div>

              <div className="container page">
                <div className="article-content">
                  <div className="col-xs-12">
                    <div dangerouslySetInnerHTML={markup} />
                  </div>
                </div>
                <div className="article-actions" />
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2">
                    <CommentList />
                  </div>
                </div>
              </div>
            </Col>

            <Col flex = '24%'>
                  <UserArticle bio = {article.author.bio ? article.author.bio: 'I am a senior frontend developer, passionate about creative coding and building interactive prototypes mixing science, art & technology. I also spend time mentoring, contribution to OSS and speaking.'}
                               location = {article.author.location ? article.author.location : 'Davis, CA'}
                               occupation = {article.author.occupation ? article.author.occupation : 'Computer Engineering Student @ UC Davis'}
                               joined = {article.author.joined ? article.author.joined : 'June 20th, 2020'}/>

                  {articles.map((article) => (
                      <ArticleCard key={article.slug} article = {article} />
                    ))}
          </Col>


          </Row>
      </BackGround>




    </div>


  );
};

ArticlePage.getInitialProps = async ({ query: { pid } }) => {
  const { data } = await ArticleAPI.get(pid);
  return data;
};

const styles = {
  customTag: {
    backgroundColor: 'white',
    border: 0,
    marginTop: '2em',
    fontSize: '1.5em'
  },
  imgContainer:{
    width: '100%',
    // height: '30em', /* height of container */
    objectFit: 'cover',
    objectPosition: '0 40%'
  },
  rightSideBar: {
    marginLeft: '2em'
  }
};

export default ArticlePage;
