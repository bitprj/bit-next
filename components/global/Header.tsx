import React from 'react';
import styled from 'styled-components';
import User from './User';
<<<<<<< HEAD
import { Button, Row, Col } from 'antd';
=======
import {Button, Space} from 'antd';
>>>>>>> parent of c478955... Merge pull request #36 from lazordiak/ArticleCard

const StyledInfoName = styled.p`
  font-size: 1em;
  line-height: 1em;
  margin-bottom: 0em;
  color: rgba(0, 0, 0, 0.5);
<<<<<<< HEAD
  padding-bottom: 0.3em;
`
const StyledInfoData = styled.p`
  font-size: 1em;
  line-height: 1.25em;
  margin-bottom: 0em;
  color: black;
=======
`
const StyledInfoData = styled.p`
  font-size: 1.25em;
  line-height: 1.25em;
  margin-bottom: 0em;
  color: #000000;
>>>>>>> parent of c478955... Merge pull request #36 from lazordiak/ArticleCard
`
const SyledDetailContainer = styled.div`
  max-width: 20em;
  font-family: Apercu Pro, sans-serif;
  font-style: normal;
  font-weight: 500;
  padding: 0.5em 1em;
  margin-left:4em;
  word-wrap: break-word;
<<<<<<< HEAD
  text-align: left;
`

const StyledBio = styled.p`
  color: black;
  padding-top: 3em;
  overflow-wrap: break-word;
`

const DetailInfo = ({ infoName, infoData }) => (
=======

`
const DetailInfo = ({infoName, infoData}) => (
>>>>>>> parent of c478955... Merge pull request #36 from lazordiak/ArticleCard
  <SyledDetailContainer>
    <StyledInfoName>{infoName}</StyledInfoName>
    <StyledInfoData>{infoData}</StyledInfoData>
  </SyledDetailContainer>
)

<<<<<<< HEAD
const Header = ({ user, follow, unfollow }) => {
  const handleClick = (e) => {
    e.preventDefault();
    user.following ? unfollow(user.username) : follow(user.username);
  };

  return (
    <Row>
      <Col span={14}>
        <Row>
          <User
            name={user.username}
            image={user.image}
            username={user.username}
            following={user.following}
            avatarSize={80}
          />
          <Button
            type={'primary'}
            size={'small'}
            onClick={handleClick}
            style={{
              background: user.following ? '#4EC700' : '#007BED',
              borderColor: user.following ? '#4EC700' : '#007BED',
              borderRadius: '0.5em',
              padding: '0em 1em',
              margin: '1.6em',
              fontSize: '0.9em',
              fontWeight: 'bold',
            }}>
            {user.following ? 'Following' : '+ Follow'}
          </Button>
        </Row>
        <StyledBio>{user.bio}</StyledBio>
      </Col>
      <Col span={10}>
        {<DetailInfo infoName={'Location'} infoData={user.location} />}
        {<DetailInfo infoName={'Joined'} infoData={user.joined} />}
        {<DetailInfo infoName={'Occupation'} infoData={user.occupation} />}
      </Col>
    </Row>
  )
}
=======
const Header = props =>(
    <Space size = {"large"} align={"start"} >
      <div>
        <Space align={"start"}>            
          <User 
              name = {props.user.name}
              image = {props.user.image}
              username = {props.user.username}
              following = {props.user.following}
              onClick = {props.user.onClick}
              avatarSize = {80}
            /> 
          <Button 
              type ={'primary'} 
              size={'small'}
              onClick = {props.user.onClick}
              style={{ 
                background: props.user.following ? '#4EC700':'#007BED' ,
                borderColor :  props.user.following ? '#4EC700':'#007BED' ,
                borderRadius: '0.5em',
                padding:'0em 1em',
                margin:'1.6em',
                fontSize: '0.9em',
                fontWeight: 'bold',
              }}>
              {props.user.following ? 'Following' : '+ Follow'}
          </Button>
        </Space>
        <p style={{marginLeft:"7em"}}>{props.user.bio}</p>
      </div>
      <div>
        {props.user.location && <DetailInfo infoName = {'Location'} infoData={props.user.location}/>}
        {props.user.joined  && <DetailInfo infoName = {'Joined'} infoData={props.user.joined}/>}
        {props.user.occupation && <DetailInfo infoName = {'Occupation'} infoData={props.user.occupation}/>}
      </div>
    </Space>
)
>>>>>>> parent of c478955... Merge pull request #36 from lazordiak/ArticleCard
export default Header

