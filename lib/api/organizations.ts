import axios from "axios";

import { SERVER_BASE_URL } from "../utils/constant";

const OrganizationsAPI = {
  follow: async (slug) => {
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/organizations/${slug}/follow`, null,
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
  changeModSettingOrg: async (org,setting) => {
    const body = JSON.stringify({organization: {modSetting: setting, old_slug: org,
                                        slug: org}});
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/organizations/${org}`,
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
  changeOrgSlug: async (org,slug) => {
    const body = JSON.stringify({organization: {old_slug: org, slug: slug}});
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/organizations/${org}`,
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
  changeOrgDescription: async (org,description) => {
    const body = JSON.stringify({organization: {description: description,
                                  old_slug: org, slug: org}});
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/organizations/${org}`,
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
  changeOrgPic: async (pic) => console.log("this will change the pic of the org",pic),
  removeFromOrg: async (org) => {
    const user: any = window.localStorage.getItem("user");
    const user2: any = JSON.parse(user);
    const token = user2?.token;
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/organizations/${org}/members`,
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
        `${SERVER_BASE_URL}/organizations/${slug}/follow`,
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
  followers: async (slug) => {
    const user: any = JSON.parse(window.localStorage.getItem("user"));
    const token = user?.token;
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/organizations/${slug}/followers`,
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
  get: async (slug) => axios.get(`${SERVER_BASE_URL}/organizations/${slug}`),
};

export default OrganizationsAPI;
