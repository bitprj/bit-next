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

const TagHeader = (props) => {
    const emoji = <Twemoji options={{ className: 'twemoji' }}>
        <StyledEmoji>{props.tag.icon ? props.tag.icon : '\ud83c\udde8\ud83c\uddf3'}</StyledEmoji>
    </Twemoji>

    const title = <span>
        <StyledSpan>{props.tag.tagname}</StyledSpan>
        <Button type="primary" size={"small"}>+ Follow</Button>
    </span>

    const description = <StyledInfo>{props.tag.description ? props.tag.description : "No description"}</StyledInfo>

    return (
        <StyledItem
            avatar={emoji}
            title={title}
            description={description}
        />
    )
};

export default TagHeader;
