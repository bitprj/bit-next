import React from "react";

import Navbar from "./Nav2";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default Layout;
