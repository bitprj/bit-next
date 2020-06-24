import React from "react";

import styled from 'styled-components';
import './User';
import { Card } from 'antd';
import User from './User';

const { Meta } = Card;

const MiniTitle = styled.div`
    font-size: 12px;
    line-height: 10px;
    color: rgba(0, 0, 0, 0.5);
    padding: 2em 0 0.5em 0;
`

const StyledBio = styled.div`
    padding-top: 1em;
    color: black;
    font-size: 12px;
`

const StyledDiv = styled.div`
    background-color: red;
    border-radius: 5px;
`

const UserMeta = styled.div`
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: black;
`

const UserArticle = (props) => {
    return (
        <StyledDiv>
            <Card bordered={false}>
                <User {...props} />
                <StyledBio>{props.bio}</StyledBio>
                <MiniTitle>Location</MiniTitle>
                <UserMeta>{props.location}</UserMeta>
                <MiniTitle>Occupation</MiniTitle>
                <UserMeta>{props.occupation}</UserMeta>
                <MiniTitle>Joined</MiniTitle>
                <UserMeta>{props.joined}</UserMeta>
            </Card>
        </StyledDiv>
    )
}

export default UserArticle;