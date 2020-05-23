import React from 'react';
import styled from 'styled-components';
import User from './User';
import { Row, Col, Button } from 'antd';

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
  font-family: Apercu Pro, sans-serif;
  font-style: normal;
  font-weight: 500;
  padding: 0.5em 1em;
  margin-left:4em;

`
const DetailInfo = ({infoName, infoData}) => (
  <SyledDetailContainer>
    <StyledInfoName>{infoName}</StyledInfoName>
    <StyledInfoData>{infoData}</StyledInfoData>
  </SyledDetailContainer>
)

const Header = props =>(
    <Row>
      <Col span={16}>
        <Row justify={"start"}>            
          <User 
              name = {props.user.name}
              imgLink = {props.user.imgLink}
              userName = {props.user.userName}
              following = {props.user.following}
              onClick = {props.user.onClick}
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
                margin:'0.5em',
                fontSize: '0.9em',
                fontWeight: 'bold',
              }}>
              {props.user.following ? 'Following' : '+ Follow'}
          </Button>
        </Row>
        <Row justify={"end"}>
          <Col span={4}></Col>
          <Col span={20}>{props.user.intro}</Col></Row>
      </Col>
      <Col  span={8}>
        {props.user.location && <DetailInfo infoName = {'Location'} infoData={props.user.location}/>}
        {props.user.joined  && <DetailInfo infoName = {'Joined'} infoData={props.user.joined}/>}
        {props.user.occupation && <DetailInfo infoName = {'Occupation'} infoData={props.user.occupation}/>}
      </Col>
    </Row>
)
export default Header

