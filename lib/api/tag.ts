import axios from "axios";

import { SERVER_BASE_URL } from "../utils/constant";

const TagAPI = {
  getAll: () => axios.get(`${SERVER_BASE_URL}/tags`),
  get: async(slug,user) => {
    const token = user?.token;

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/tags/${slug}`,
        {
          headers: {
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }},
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
  }
, moderators: async (slug,member) => {
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
