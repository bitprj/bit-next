import axios from "axios";

import { SERVER_BASE_URL } from "../utils/constant";
import { getQuery } from "../utils/getQuery";

const ArticleAPI = {
  all: (page, limit = 10) =>
    axios.get(`${SERVER_BASE_URL}/articles?${getQuery(limit, page)}`),

  byAuthor: (author, page = 0, limit = 5) =>
    axios.get(
      `${SERVER_BASE_URL}/articles?author=${encodeURIComponent(
        author
      )}&${getQuery(limit, page)}`
    ),

  byTag: (tag, page = 0, limit = 10) =>
    axios.get(
      `${SERVER_BASE_URL}/articles?tag=${encodeURIComponent(tag)}&${getQuery(
        limit,
        page
      )}`
    ),

  delete: (id, token) =>
    axios.delete(`${SERVER_BASE_URL}/articles/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    }),

  favorite: (slug) =>
    axios.post(`${SERVER_BASE_URL}/articles/${slug}/favorite`),

  favoritedBy: (author, page) =>
    axios.get(
      `${SERVER_BASE_URL}/articles?favorited=${encodeURIComponent(
        author
      )}&${getQuery(10, page)}`
    ),

  feed: (page, limit = 10) =>
    axios.get(`${SERVER_BASE_URL}/articles/feed?${getQuery(limit, page)}`),

  get:  async(slug,user) => {
    const token = user?.token;
    try {
      if(token != null){
      const response = await axios.get(
        `${SERVER_BASE_URL}/articles/${slug}`,
        {
          headers: {
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
      }else{
        const response = await axios.get(
          `${SERVER_BASE_URL}/articles/${slug}`
        );
        return response;

      }
    } catch (error) {
      return error.response;
    }},

  unfavorite: (slug) =>
    axios.delete(`${SERVER_BASE_URL}/articles/${slug}/favorite`),

  update: async (article, token) => {
    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/articles/${article.slug}`,
      JSON.stringify({ article }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${encodeURIComponent(token)}`,
        },
      }
    );
    return {
      data,
      status,
    };
  },

  create: async (article, token) => {
    const { data, status } = await axios.post(
      `${SERVER_BASE_URL}/articles`,
      JSON.stringify({ article }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${encodeURIComponent(token)}`,
        },
      }
    );
    return {
      data,
      status,
    };
  },
  bookmark : async(slug,token)=>{
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/articles/${slug}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }

  },
  removeBookmark : async(slug,token)=>{
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/articles/${slug}/bookmark`,
        {
          headers: {
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }

  },
};

export default ArticleAPI;
