import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import Router from "next/router";
import axios from "axios";


import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import Maybe from "../common/Maybe";
import Pagination from "../common/Pagination";
import { usePageState } from "../../lib/context/PageContext";
import {
  usePageCountState,
  usePageCountDispatch,
} from "../../lib/context/PageCountContext";
import useViewport from "../../lib/hooks/useViewport";
import { SERVER_BASE_URL, DEFAULT_LIMIT } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import ArticleCard from "../../components/global/ArticleCard";
import CustomLink from "../common/CustomLink";
import ArticleAPI from "../../lib/api/article";
import {message} from 'antd';


const ArticleList = (props) => {
  const [refresh,setRefresh] = React.useState(false)

  const page = usePageState();
  const pageCount = usePageCountState();
  const setPageCount = usePageCountDispatch();
  const lastIndex =
    pageCount > 480 ? Math.ceil(pageCount / 20) : Math.ceil(pageCount / 20) - 1;

  const { vw } = useViewport();
  const router = useRouter();
  const { asPath, pathname, query } = router;
  const { favorite, follow, tag, pid } = query;

  const isProfilePage = pathname.startsWith(`/profile`);

  let fetchURL = `${SERVER_BASE_URL}/articles?offset=${page * DEFAULT_LIMIT}`;
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);

  switch (true) {
    case !!tag:
      fetchURL = `${SERVER_BASE_URL}/articles${asPath}&offset=${
        page * DEFAULT_LIMIT
        }`;
      break;
    case isProfilePage && !!favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?favorited=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case isProfilePage && !favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?author=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case !isProfilePage && !!follow:
      fetchURL = `${SERVER_BASE_URL}/articles/feed?offset=${
        page * DEFAULT_LIMIT
        }`;
      break;
    default:
      break;
  }

  const { data, error } = useSWR(fetchURL, fetcher);

  if (error) {
    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active"></ul>
        </div>
        <ErrorMessage message="Cannot load recent articles..." />
      </div>
    );
  }

  if (!data) return <LoadingSpinner />;

  const { articles, articlesCount } = !props.articles && !props.articlesCount ? data : props;

  setPageCount(articlesCount);

  if (articles && articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }
  
  const rightButtonClicked=async(e,slug,bookmarked)=>{
    e.preventDefault()
    if(currentUser == null){
      message.info('Please Sign in');
    }else{

      if(!bookmarked){
        
        await ArticleAPI.bookmark(slug,currentUser.token);
      }else{
        await ArticleAPI.removeBookmark(slug,currentUser.token); 
      }
      for (let index in props.articles){
        if(props.articles[index].slug== slug){
          props.articles[index].bookmarked = !bookmarked
          break;
        }
      }
      setRefresh(!refresh)

    }

  }
    const handleClickFavorite = async (e,slug,favorited) => {
    e.preventDefault()
    if (!isLoggedIn) {
      Router.push(`/user/login`);
      return;
    }
    try {
      if (favorited) {
       await axios.delete(`${SERVER_BASE_URL}/articles/${slug}/favorite`, {
          headers: {
            Authorization: `Token ${currentUser?.token}`,
          },
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
        );
     
      }
      for (let index in props.articles){
        if(props.articles[index].slug== slug){
          props.articles[index].favorited = !favorited
          break;
        }
      }
      setRefresh(!refresh)
    } catch (error) {
     
    }
  };
  return (
    <>
      {articles?.map((article) => (
        <CustomLink
          href="/article/[pid]"
          as={`/article/${article.slug}`}
          className="preview-link"
        >
          <ArticleCard key={article.slug} article={article} onRightButtonClick ={(e)=>rightButtonClicked(e,article.slug,article.bookmarked)} favoriteClick = {(e)=>handleClickFavorite(e,article.slug,article.favorited)}  />
        </CustomLink>
      ))}

      <Maybe test={articlesCount && articlesCount > 20}>
        <Pagination
          total={pageCount}
          limit={20}
          pageCount={vw >= 768 ? 10 : 5}
          currentPage={page}
          lastIndex={lastIndex}
          fetchURL={fetchURL}
        />
      </Maybe>
    </>
  );
};

export default ArticleList;
