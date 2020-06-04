import React from 'react'
import User from './User'
import styled from 'styled-components'
import {List, Button} from 'antd'
import useSWR, { mutate, trigger } from "swr";
import { useRouter } from "next/router";
import ErrorMessage from "../../components/common/ErrorMessage";
import UserAPI from "../../lib/api/user";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";

const StyledListItem = styled(List.Item)`
    font-size: 0.85em;
    width: 100%;
    padding: 2em;
    margin: 1.5em auto;
    border-radius: 0.6em;
    background: #FFFFFF;
`

const FollowList = ({followings}) =>{
  
  const followStr = followings ? "followings" : "followers";
  const router = useRouter();
  const { query: { pid }} = router;

  const {
    data: fetchedFollwList,
    error: FollowListError,
  } = useSWR(
    `${SERVER_BASE_URL}/profiles/${encodeURIComponent(String(pid))}/${followStr}`,
    fetcher,
  );

  if (FollowListError) return <ErrorMessage message={"Can't load " + followStr}/>;

  const handleFollow = async (username, email) => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}/${followStr}`,
       fetchedFollwList.map((Item)=>{
         if(Item.user.username === username){
           return {user: {...Item.user, following : true}}
         }else{
           return Item;
         }
       })
    )
    UserAPI.follow(username, email);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}/${followStr}`);
  };

  const handleUnfollow = async (username) => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}/${followStr}`,
       fetchedFollwList.map((Item)=>{
         if(Item.user.username === username){
           return {user: {...Item.user, following : false}}
         }else{
           return Item;
         }
       })
    )
    UserAPI.unfollow(username);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}/${followStr}`);
  };

  return(
    <List
      itemLayout="horizontal"
      dataSource={fetchedFollwList}
      renderItem={({user}) => {
        const {name, image, username, following, email} = user;
        const handleClick = (e)=>{
          e.preventDefault();
          following ? handleUnfollow(username) : handleFollow(username, email);
        }
        return(
          <StyledListItem>
            <User 
                name = {name}
                image = {image}
                username = {username}
                following = {following}
              >
            </User>
            <Button 
              type ={'primary'} 
              size ={'middle'}
              onClick= {handleClick}
              style={{ 
                background: following ? '#DD2E44':'#007BED' ,
                borderColor :  following ? '#DD2E44':'#007BED' ,
                borderRadius: '0.5em',
                padding:'0em 1em',
                fontSize: '1em',
                fontWeight: 'bold',
              }}
            
            >
              {following ? 'Following' : '+ Follow'}
            </Button>
          </StyledListItem>
        )
      }}
    />
  )
};

export default FollowList