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

const StyledAvatar = styled(Avatar)`
  margin-right: 0.5em;
  background: #FFFFFF;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
`

const StyledList = styled(List)`
  .ant-list-item {
    border: none;
  }
`

const StyledListItem = styled(List.Item)`
  padding: 5px 0;
`

const StyledSpan = styled.span`
  color: black;
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
            href={`/?tag=${tag}`}
            as={`/?tag=${tag}`}
          >
            <StyledSpan onClick={handleClick}>
              <StyledAvatar>🤩</StyledAvatar>
              {tag}
            </StyledSpan>
          </CustomLink>
        </StyledListItem>
      )}
    />
    // <div className="tag-list">
    // {tags?.map((tag) => (
    //   <CustomLink
    //     key={tag}
    //     href={`/?tag=${tag}`}
    //     as={`/?tag=${tag}`}
    //     className="tag-default tag-pill"
    //   >
    //     <span onClick={handleClick}>{tag}</span>
    //   </CustomLink>
    // ))}
    // </div>
  );
};

export default Tags;
