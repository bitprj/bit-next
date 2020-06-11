import marked from "marked";
import Router, { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import axios from "axios";
import storage from "../../lib/utils/storage";
import styled from 'styled-components';
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

import UserArticle from "../../components/global/UserInfoCard";
import ArticleCard from "../../components/article/UserArticleCard";
import ArticleMeta from "../../components/article/ArticleMeta";
import CommentList from "../../components/comment/CommentList";
import ArticleAPI from "../../lib/api/article";
import { Article } from "../../lib/types/articleType";
import ArticleTags from "../../components/article/ArticleTags";

const ArticleContain = styled.div`  
  width: 880px;
  max-width: 100%;
  margin: 70px auto 20px;
  text-align: left;
  background-color: white;
  @media screen and (min-width: 1250px) {
        margin-left:16px
  }
`;

const StickyRight = styled.div`  
  display: none;
  @media screen and (min-width: 1250px) {
      display:block;
      position: fixed;
      left: calc(50% + 298px);
      top: 70px;
      bottom: 20px;
      padding: 0 2px;
      display: flex;
      flex-flow: column wrap;
      overflow: hidden;
      z-index: 100;
      width: 300px;
  }
`;

const ArticleBody = styled.div`
  padding: 2em;
`

const ArticleMD = styled.div`
  margin-top: 2em;
`

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

  let { articles } = fetchedArticles || [];

  articles = articles ? articles.slice(0, Math.min(articles.length, 5)) : [];

  const [preview, setPreview] = React.useState({ ...article, bookmarked: false, bookmarkCount: null });
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);

  const handleClickFavorite = async slug => {
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

  const handleClickBookmark = async slug => {
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
      <ArticleContain>
        <img src={(article as any).image ? (article as any).image : staticSrc} alt='image' style={{ objectFit: 'cover', objectPosition: '0 40%', width: '100%' }} />
        <ArticleBody>
          <ArticleTags article={article} />
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
          <ArticleMD dangerouslySetInnerHTML={markup} />
          <div className="article-actions" />
          <CommentList />
        </ArticleBody>
      </ArticleContain>
      <StickyRight>
        <UserArticle {...article.author} />
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </StickyRight>
    </div>
  );
};

ArticlePage.getInitialProps = async ({ query: { pid } }) => {
  const { data } = await ArticleAPI.get(pid);
  return data;
};

export default ArticlePage;
