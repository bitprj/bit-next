import React from 'react';
import styled from 'styled-components';
import User from './User';
import {Button, Space, Row, Col} from 'antd';

const StyledInfoName = styled.p`
  font-size: 1em;
  line-height: 1em;
  margin-bottom: 0em;
  color: rgba(0, 0, 0, 0.5);
`
const StyledInfoData = styled.p`
  font-size: 1.25em;
  line-height: 1.25em;
  margin-bottom: 0em;
  color: #000000;
`
const SyledDetailContainer = styled.div`
  max-width: 20em;
  font-family: Apercu Pro, sans-serif;
  font-style: normal;
  font-weight: 500;
  padding: 0.5em 1em;
  margin-left:4em;
  word-wrap: break-word;
  text-align: left;

`
const DetailInfo = ({infoName, infoData}) => (
  <SyledDetailContainer>
    <StyledInfoName>{infoName}</StyledInfoName>
    <StyledInfoData>{infoData}</StyledInfoData>
  </SyledDetailContainer>
)




const Header = ({user, follow, unfollow}) =>{
  
  const handleClick = (e) => {
    e.preventDefault();
    user.following ? unfollow(user.username) : follow(user.username);
  };

  return (
    <Row>
      <Col span = {14}>
        <Row>           
          <User 
              name = {user.username}
              image = {user.image}
              username = {user.username}
              following = {user.following}
              avatarSize = {80}
            /> 
          <Button 
              type ={'primary'} 
              size={'small'}
              onClick = {handleClick}
              style={{ 
                background: user.following ? '#4EC700':'#007BED' ,
                borderColor :  user.following ? '#4EC700':'#007BED' ,
                borderRadius: '0.5em',
                padding:'0em 1em',
                margin:'1.6em',
                fontSize: '0.9em',
                fontWeight: 'bold',
              }}>
              {user.following ? 'Following' : '+ Follow'}
          </Button>
        </Row>  
        <p style={{marginLeft:"7em"}}>{user.bio}</p>
      </Col>
      <Col span = {10}>
        {<DetailInfo infoName = {'Location'} infoData={user.location}/>}
        {<DetailInfo infoName = {'Joined'} infoData={user.joined}/>}
        {<DetailInfo infoName = {'Occupation'} infoData={user.occupation}/>}
      </Col>
    </Row>
  )
}
export default Header

