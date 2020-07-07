import marked from "marked";
import Router, { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import axios from "axios";
import storage from "../../lib/utils/storage";
import styled from 'styled-components';
import checkLogin from "../../lib/utils/checkLogin";
import Twemoji from 'react-twemoji';
import { SERVER_BASE_URL } from "../../lib/utils/constant";

import UserArticle from "../../components/global/UserInfoCard";
import ArticleCard from "../../components/article/UserArticleCard";
import ArticleMeta from "../../components/article/ArticleMeta";
import CommentList from "../../components/comment/CommentList";
import ArticleAPI from "../../lib/api/article";
import { Article } from "../../lib/types/articleType";
import ArticleTags from "../../components/article/ArticleTags";
import { ppid } from "process";

const ArticleContain = styled.div`  
  width: 880px;
  max-width: 100%;
  margin: 70px auto 20px;
  text-align: left;
  background-color: white;
  @media screen and (min-width: 1250px) {
        margin-left:16px
  }
  display : flex;
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
  width: 100%
`

const ArticleDisplay = styled.div`
width :100%;
`

const ArticleMD = styled.div`
  margin-top: 2em;
`
const StyledEmoji = styled.div`
padding: 0.5em;
margin :0.5em;
border-radius: 22px;

  img {
      width: 20px;
    }
    background: white;

`
const StyledEmoji2 = styled.div`
background: red;
border-radius: 22px;
padding: 0.5em;
margin :0.5em;
  img {
      width: 20px;
    }
`

const Image = styled.img`
width :100%;
object-fit: cover;
object-position: 0 40%;
`
const ArticlePage = (id) => {
  const [mainArticles,setMainArticles] = React.useState([])
  const [fetchedArticle,setFetchedArticle] =React.useState([])
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const getArticles = async (currentUser) => {
		if (id != null) {
      const { data: fetchedArticle } = await ArticleAPI.get(id.id, currentUser);
      setPreview({ ...article, favorited: fetchedArticle.article.favorited,bookmarked: false, bookmarkCount: null 
    })
    setMainArticles(fetchedArticle)
		}
	}
	
	React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"))
    getArticles(user)
    let  { article }: any = mainArticles;
    if(article != null){
    const { data: fetchedArticles } = useSWR(
      `${SERVER_BASE_URL}/articles?author=${article.author.username}`,
      fetcher
    );
    setFetchedArticle(fetchedArticles)
    }
	}, [id]);

  let  { article }: any = mainArticles;
  let { articles } : any = fetchedArticle || [];

  articles = articles ? articles.slice(0, Math.min(articles.length, 5)) : [];

  const [preview, setPreview] = React.useState({ ...article, bookmarked: false, bookmarkCount: null });
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const handleClickFavorite = async slug => {
    if (!isLoggedIn) {
      Router.push(`/user/login`);
      return;
    }
    
    try {
      if (preview.favorited) {
        await axios.delete(`${SERVER_BASE_URL}/articles/${slug}/favorite`, {
          headers: {
            Authorization: `Token ${currentUser?.token}`,
          },
        });
        setPreview({
          ...preview,
          favorited: !preview.favorited,
          favoritesCount: preview.favorited
            ? preview.favoritesCount - 1
            : preview.favoritesCount + 1,
        });
      } else {
       await axios.post(
          `${SERVER_BASE_URL}/articles/${slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Token ${currentUser?.token}`,
            },
          }
        )
      }
      setPreview({
        ...preview,
        favorited: !preview.favorited,
        favoritesCount: preview.favorited
          ? preview.favoritesCount - 1
          : preview.favoritesCount + 1,
      });
    } catch (error) {
      
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
      setPreview({
        ...preview,
        bookmarked: !preview.bookmarked,
        bookmarkCount: preview.bookmarked
          ? preview.bookmarkCount - 1
          : preview.bookmarkCount + 1,
      });
    }
  };
if(article != null){
  const markup = {
    __html: marked(article.body, { sanitize: true }),
  };
  return (
    <div className="article-page">
    
      <ArticleContain>
      <Twemoji options={{ className: 'twemoji' }}>
                  {!preview.favorited?
                   <StyledEmoji2  onClick = {()=>handleClickFavorite(article.slug)}>{'🤍 '}</StyledEmoji2>
                   : <StyledEmoji onClick = {()=>handleClickFavorite(article.slug)}>{"❤️ "}</StyledEmoji>}
                 
                  </Twemoji>
        <ArticleBody>
        <Image src={(article as any).image} />
          <ArticleDisplay>
          <ArticleTags article={article} />
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
          <ArticleMD dangerouslySetInnerHTML={markup} />
          <div className="article-actions" />
          <CommentList />
          </ArticleDisplay>
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
}else{
  return (<div></div>)
}
}

ArticlePage.getInitialProps = async ({ query: { pid } }) => {
  let id = pid
  return { id };
};

export default ArticlePage;
