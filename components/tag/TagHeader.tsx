import React from "react";
import styled from 'styled-components';
import Twemoji from 'react-twemoji';

import { Button, List } from 'antd';

const StyledEmoji = styled(Twemoji)`
  .emoji {
    width: 20px;
    height: 20px;
  }
`

const StyledInfo = styled.p`
    margin-top: 1em;
    font-size: 11px;
    line-height: 17px;
    color: #000000;
`

const StyledItem = styled(List.Item.Meta)`
  padding: 14px;
`

const StyledSpan = styled.span`
    font-size: 23px;
    font-weight: bold;
    line-height: 20px;
    padding-right: 15px;
    color: #000000;
`

const FollowButton = styled(Button)`
    background : ${props => props.following ? "green" : ""} !important; 
`

const TagHeader = ({ tagData, follow, unfollow }) => {
    const [following, setFollowing] = React.useState(tagData.following)
    const handleClick = (e) => {
        e.preventDefault();
        tagData.following ? unfollow(tagData.slug) : follow(tagData.slug);
        setFollowing(!tagData.following)
        tagData.following = tagData.following === true ? false : true;
    };

    return (
        <StyledItem
            avatar={
                <Twemoji options={{ className: 'twemoji' }}>
                    <StyledEmoji>{tagData.icon ? tagData.icon : '\ud83c\udde8\ud83c\uddf3'}</StyledEmoji>
                </Twemoji>
            }
            title={
                <span>
                    <StyledSpan>{tagData.tagname}</StyledSpan>
                    {tagData.following ? <FollowButton
                        type={"primary"}
                        size={"small"}
                        following={tagData.following}
                        onClick={handleClick}
                    >Following</FollowButton> :
                        <FollowButton
                            type={"primary"}
                            size={"small"}
                            following={tagData.following}
                            onClick={handleClick}
                        >+ Follow</FollowButton>}
                </span >
            }
            description={
                < StyledInfo > {tagData.description ? tagData.description : "No description"}</StyledInfo >
            }
        />
    )
};

export default TagHeader;
