import React from 'react'
import ArticleCard from './ArticleCard'
import {List} from 'antd'

const ArticleList = props =>(
    <List
      itemLayout="horizontal"
      dataSource={props.articles}
      renderItem={article => (
        <List.Item>
           <ArticleCard 
              article = {article}
              onLeftButtonClick = {props.onLeftButtonClick}
              onRightButtonClick = {props.onRightButtonClick}
            />
        </List.Item>
      )}
    />
);

export default ArticleList