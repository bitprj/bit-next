import axios from "axios";

import { SERVER_BASE_URL } from "../utils/constant";

const TagAPI = {
  getAll: () => axios.get(`${SERVER_BASE_URL}/tags`),
  get: (slug) => axios.get(`${SERVER_BASE_URL}/tags/${slug}`),
  follow: async (slug) => {
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/tags/${slug}/follow`,
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

  rejectTag: async (article, currentTag) => {
    console.log(article)
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
    console.log(`${SERVER_BASE_URL}/tags/${currentTag}/articles/${article.slug}`)
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/tags/${currentTag}/articles/${article.slug}`,
        { article },
        {
          headers: {
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  unfollow: async (slug) => {
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/tags/${slug}/follow`,
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
  changeModSettingTag: async (tag,setting) => {
    const user: any = window.localStorage.getItem("user");
    const token = user?.token;
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/organizations/${tag}`,
        JSON.stringify({ setting }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
      console.log(response);
    } catch (error) {
      return error.response;
    }
  },
  moderators: async (slug,member) => {
  const user: any = JSON.parse(window.localStorage.getItem("user"));
  const token = user?.token;
  try {
    const response = await axios.post(
      `${SERVER_BASE_URL}/tags/${slug}/moderator/${member}`,{},
      {
        headers: {
          Authorization: `Token ${encodeURIComponent(token)}`,
        }
      }
    );
    return response
  } catch (error) {
    return error.response;
  }

},getMembers :(slug) => axios.get(`${SERVER_BASE_URL}/tags/${slug}/members`)};
export default TagAPI;
