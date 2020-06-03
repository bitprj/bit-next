import React from "react";

import CustomLink from "../common/CustomLink";
import LoadingSpinner from "../common/LoadingSpinner";
import { usePageDispatch } from "../../lib/context/PageContext";
import useSWR from "swr";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import styled from 'styled-components';
import ErrorMessage from "../common/ErrorMessage";
import { List, Avatar } from 'antd';
import Twemoji from 'react-twemoji';

const StyledAvatar = styled(Avatar)`
  background: #FFFFFF;

  .twemoji {
    width: 20px;
    height: 20px;
    margin-left: 6.1px;
    margin-top: 5.2px;
  }
`

const StyledList = styled(List)`
  .ant-list-item {
    padding: 0;
  }
  
  .ant-list-item {
    border: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const StyledListItem = styled(List.Item)`
  padding: 5px 0;
  color: black;
`

const StyledSpan = styled.span`
  color: black;
`

const StyledTwemoji = styled(Twemoji)`
  display: inline;
  padding-right: 11px;
`

const Tags = () => {
  const setPage = usePageDispatch();
  const handleClick = React.useCallback(() => setPage(0), []);
  const { data, error } = useSWR(`${SERVER_BASE_URL}/tags`, fetcher);

  if (error) return <ErrorMessage message="Cannot load popular tags..." />;
  if (!data) return <LoadingSpinner />;

  const { tags } = data;

  return (
    <StyledList
      itemLayout="horizontal"
      dataSource={tags}
      renderItem={tag => (
        <StyledListItem>
          <CustomLink
            href={`/tag/[pid]`}
            as={`/tag/${encodeURIComponent(tag[1])}`}
          >
            <span>
              <StyledTwemoji options={{ className: 'twemoji' }}>
                <StyledAvatar icon="🤩" />
              </StyledTwemoji>
              <StyledSpan>{tag[0]}</StyledSpan>
            </span>
          </CustomLink>
        </StyledListItem>
      )}
    />
  );
};

export default Tags;
