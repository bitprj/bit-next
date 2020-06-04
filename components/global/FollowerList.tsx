import React from 'react'
import User from './User'
import styled from 'styled-components'
import { List, Button } from 'antd'

const StyledListItem = styled(List.Item)`
    font-size: 0.85em;
    width: 100%;
    padding: 2em;
    margin: 1.5em auto;
    border-radius: 0.6em;
    background: #FFFFFF;
`

const FollowerList = props => {
  console.log(props.followers)
  props.followers.forEach(element => {
    console.log(element.user)
  });
  return (
    <List
      itemLayout="horizontal"
      dataSource={props.followers}
      renderItem={follower => (
        <StyledListItem>
          <User
            name={follower['user']['name']}
            image={follower['user']['image']}
            username={follower['user']["username"]}
            following={follower['user']['following']}
            onClick={follower['user']['onClick']}
          >
          </User>
          <Button
            type={'primary'}
            size={'middle'}
            onClick={props.onClick}
            style={{
              background: follower['user']['following'] ? '#DD2E44' : '#007BED',
              borderColor: follower['user']['following'] ? '#DD2E44' : '#007BED',
              borderRadius: '0.5em',
              padding: '0em 1em',
              fontSize: '1em',
              fontWeight: 'bold',
            }}>
            {follower['user']['following'] ? 'Delete' : '+ Follow'}
          </Button>
        </StyledListItem>
      )}
    />
  )
};

export default FollowerList