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
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
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
  },
  changeModSettingTag: async (tag,setting) => {
    const body = JSON.stringify({tag: {modSetting: setting }});
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/tags/${tag}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  },
  changeTagDescription: async (tag,description) => {
    const body = JSON.stringify({tag: description });
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/tags/${tag}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  },
  changeTagSlug: async (tag,slug) => {
    const body = JSON.stringify({tag: {slug: slug, old_slug: tag}});
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/tags/${tag}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(token)}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  },
  changeTagPic: async (pic) => console.log("this will change the pic of the tag",pic),
  moderators: async (slug,member) => {
  const user: any = JSON.parse(window.localStorage.getItem("user"));
  const token = user?.token;
  try {
    const response = await axios.put(
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
