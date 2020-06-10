import React from "react";

import Navbar from "./Navbar";
import AuthTest from "../authTestNav/test";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default Layout;
