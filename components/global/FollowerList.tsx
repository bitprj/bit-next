import React from 'react';
import User from './User'
import {List, Button} from 'antd';

const FollowerList = props =>(
  <>
    <List
      itemLayout="horizontal"
      dataSource={props.followers}
      renderItem={follower => (
        <List.Item
          style={{
            fontSize: "0.85em",
            width: "100%",
            padding: "2em",
            margin: "1.5em auto",
            borderRadius: "0.6em",
            background: "#FFFFFF",
            display:"flex",
            justifyContent: "space-between",
            alignItems: "center"
    
          }}
        >
           <User 
              name = {follower['name']}
              imgLink = {follower['imgLink']}
              userName = {follower['userName']}
              following = {follower['following']}
              onClick = {follower['onClick']}  
            >
          </User>
          <Button 
            type ={'primary'} 
            size ={'middle'}
            onClick = {props.onClick}
            style={{ 
              background: follower['following'] ? '#DD2E44':'#007BED' ,
              borderColor :  follower['following'] ? '#DD2E44':'#007BED' ,
              borderRadius: '0.5em',
              padding:'0em 1em',
              fontSize: '1em',
              fontWeight: 'bold',
            }}>
            {follower['following'] ? 'Delete' : '+ Follow'}
          </Button>
        </List.Item>
      )}
    />
  </>
);

export default FollowerList