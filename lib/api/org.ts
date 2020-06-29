import axios from "axios";

import { SERVER_BASE_URL } from "../utils/constant";

const OrgAPI = {

  changeModSettingOrg: async (org,setting) => {
    const user: any = window.localStorage.getItem("user");
    const token = user?.token;
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/organizations/${org}`,
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

  removeFromOrg: async (org) => {
    const user: any = window.localStorage.getItem("user");
    const token = user?.token;
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
      console.log(response);
    } catch (error) {
      return error.response;
    }
  },

}

export default OrgAPI;
