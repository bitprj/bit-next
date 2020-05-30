import React from 'react';
import styled from 'styled-components';
import User from './User';
import {Button, Space} from 'antd';

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

`
const DetailInfo = ({infoName, infoData}) => (
  <SyledDetailContainer>
    <StyledInfoName>{infoName}</StyledInfoName>
    <StyledInfoData>{infoData}</StyledInfoData>
  </SyledDetailContainer>
)

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
export default Header

