import React from 'react';
import User from './User'
import styled from 'styled-components'
import { List, Skeleton, Button } from 'antd';
import OrgAPI from "../../lib/api/org";

const StyledHeader = styled.div`
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.7em;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 1em;
`

const UserList = (props) => {

  const handleClick = () => {
    OrgAPI.removeFromOrg(props.currentOrg);
  }

  return (
    <>
      <StyledHeader>{props.header}</StyledHeader>
      <List
        className="user-list"
        itemLayout="horizontal"
        dataSource={props.users}
        renderItem={user => (
          <List.Item style={{ border: 'none' }}>
            <Skeleton avatar title={false} loading={props.loading} active>
              <User
                name={user['profile']['username']}
                image={user['profile']['image']}
                username={user['profile']['username']}
                following={user['following']}
                onClick={props['onClick']}
              />
              <Button
                type={'primary'}
                size={'middle'}
                onClick={handleClick}
                style={{
                  background: '#DD2E44',
                  borderColor: '#DD2E44',
                  borderRadius: '0.5em',
                  padding: '0em 1em',
                  fontSize: '1em',
                  fontWeight: 'bold',
                }}
              >
                Delete
              </Button>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  )
}

export default UserList
