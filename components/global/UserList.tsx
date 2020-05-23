import React from 'react';
import User from './User'
import styled from 'styled-components'
import {List, Skeleton} from 'antd';

const StyledHeader = styled.div`
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.7em;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 1em;
`
const UserList = (props) => (
  <>
    <StyledHeader>{props.header}</StyledHeader>
    <List
      className="user-list"
      itemLayout="horizontal"
      dataSource={props.users}
      renderItem={ user => (
        <List.Item style={{border: 'none'}}>
          <Skeleton avatar title={false} loading={props.loading} active>
            <User 
              name = {user['name']}
              imgLink = {user['imgLink']}
              userName = {user['userName']}
              following = {user['following']}
              onClick = {props['onClick']}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  </>
)

export default UserList