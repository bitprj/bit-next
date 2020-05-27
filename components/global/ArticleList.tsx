import React from 'react'
import styled from 'styled-components'
import ArticleCard from './ArticleCard'
import {List} from 'antd'

// const StyledListItem = styled(List.Item)`
//     font-size: 0.85em;
//     width: 100%;
//     padding: 2em;
//     margin: 1.5em auto;
//     border-radius: 0.6em;
//     background: #FFFFFF;
// `

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