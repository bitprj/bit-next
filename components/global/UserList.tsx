import React from 'react';
import User from './User'
import styled from 'styled-components';
import {List, Skeleton, Button} from 'antd';
import UserAPI from '../../lib/api/user';

const StyledHeader = styled.div`
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.7em;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0.2em;
`

const UserList = (props) => {

  const follow = user => {
    if(user.profile.following == false){
      UserAPI.follow(user.profile.username,user.profile.email)
    }
    else{
      UserAPI.unfollow(user.profile.username)
    }
  }

  return(
    <div>
      <StyledHeader>{props.header}</StyledHeader>
      <List
        className="user-list"
        itemLayout="horizontal"
        dataSource={props.users}
        renderItem={ user => {
          const handleClick = () => {
            follow(user)
          }
          return(
            <List.Item style={{border: 'none'}}>
              <Skeleton avatar title={false} loading={props.loading} active>
                <User 
                  name = {user['profile']['username']}
                  image = {user['profile']['image']}
                  username = {user['profile']['username']}
                  following = {user['profile']['following']}
                />
                <Button
                type={'primary'}
                size={'small'}
                onClick={handleClick}
                style={{
                  background: user['profile']['following'] ? '#4EC700' : '#007BED',
                  borderColor: user['profile']['following'] ? '#4EC700' : '#007BED',
                  borderRadius: '0.5em',
                  padding: '0em 1em',
                  margin: '1.6em',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                }}>
                {user['profile']['following'] ? 'Following' : '+ Follow'}
              </Button>
              </Skeleton>
            </List.Item>
        )}}
      />
    </div>
  )
}

export default UserList