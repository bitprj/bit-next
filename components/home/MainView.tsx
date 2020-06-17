import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

import ArticleList from "../article/ArticleList";
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const MainView = () => {
  const {
		data: fetchedArticles,
	} = useSWR(
		`${SERVER_BASE_URL}/user/tags/articles`,
		fetcher
  );
  
  return (
    <div className="col-md-9">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Your Feed" key="1">
          <ArticleList {...fetchedArticles} />
        </TabPane>
        <TabPane tab="Global Feed" key="2">
          <ArticleList />
        </TabPane>
      </Tabs>
    </div>
  )
};

export default MainView;
