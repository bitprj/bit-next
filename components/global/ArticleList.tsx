import React from 'react'
import ArticleCard from './ArticleCard'
import {List} from 'antd'
import TagAPI from "../../lib/api/tag";

const ArticleList = props =>(
    <List
      itemLayout="horizontal"
      dataSource={props.articles}
      renderItem={article => (
        <List.Item>
          {props.modReview ? <ArticleCard
             article = {article}
             modReview = {props.modReview}
             onLeftButtonClick = {() => TagAPI.rejectTag(article,props.currentTag)}
             onRightButtonClick = {props.onRightButtonClick}
           /> : <ArticleCard
              article = {article}
              onLeftButtonClick = {props.onLeftButtonClick}
              onRightButtonClick = {props.onRightButtonClick}
            />}
        </List.Item>
      )}
    />
);

export default ArticleList
