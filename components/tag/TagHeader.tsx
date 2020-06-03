import React from "react";
import useSWR, { mutate, trigger } from "swr";
import storage from "../../lib/utils/storage";

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

const TagHeader = ({ tagData, follow, unfollow }) => {
    // console.log(tagData)
    // const { data: currentUser } = useSWR("user", storage);

    const handleClick = (e) => {
        e.preventDefault();
        tagData.following ? unfollow(tagData.slug) : follow(tagData.slug);
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
                    <Button
                        type="primary"
                        size={"small"}
                        onClick={handleClick}
                    >+ Follow</Button>
                </span >
            }
            description={
                < StyledInfo > {tagData.description ? tagData.description : "No description"}</StyledInfo >
            }
        />
    )
};

export default TagHeader;
