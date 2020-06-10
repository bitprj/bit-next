import React from "react";

import Layout from "../components/common/Layout";
import ContextProvider from "../lib/context";
import "../styles.css";
import 'antd/dist/antd.css';

import { Provider } from "next-auth/client";

if (typeof window !== "undefined") {
  require("lazysizes/plugins/attrchange/ls.attrchange.js");
  require("lazysizes/plugins/respimg/ls.respimg.js");
  require("lazysizes");
}

export default ({ Component, pageProps }) => {
  return (
      <ContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
  );
};
