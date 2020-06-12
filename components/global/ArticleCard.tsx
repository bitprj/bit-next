import React from 'react';
import styled from 'styled-components'
import Twemoji from 'react-twemoji';
import User from '../global/User'
import { Row, Col, Card, Avatar, Button, Space } from 'antd';
import CustomLink from "../common/CustomLink";

const StyledCard = styled(Card)`
  flex:auto;
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  background: #FFFFFF;
  border-radius: 0px 0px 0.5em 0.5em;
  margin-top: 30px;
  margin-bottom: 15px;
`

const StyledSpan = styled.span`
  a {
    color: black;
    font-weight: 500;
  }
`

const StyledTag = styled.p`
  font-size: 1em;
  line-height: 1em;
  padding: 1em 1.5em;
  background: #FFE870;
  border-radius: 0.5em;
  color: #000000;
`
const TitleDiv = styled.div`
  font-size: 1.56em;
  line-height: 1.5em;
  color: #000000;
  margin-bottom:0.2em; 
`
const TagsDiv = styled.div`
  font-size: 0.7em;
  line-height: 1em;
  color: #383838;
  margin-bottom:1em; 
`
const AuthDiv = styled.div`
  font-size: 0.7em;
  line-height: 1em;
  color: rgba(56, 56, 56, 0.7);
  margin-bottom:1em;  
`
const StatDiv = styled(Row)`
  font-size: 1em;
  line-height: 0.8em;
  color: #707070;
  margin-top: 1em;
  display: flex;
  justify-content : space-between;
  align-items: center; 
`

const StyledEmoji = styled.span`
  padding-right: 15px;

  img {
      width: 20px;
    }
`

/* article state: draft, review, pubished, complete*/
const ArticleCard = ({ article, showAuth = false, onLeftButtonClick = null, onRightButtonClick = null }) => {
  const tags = article.tagList.map((tag, i) =>
    (<StyledSpan>
      <CustomLink
        key={i}
        href={`/tag/[pid]`}
        as={`/tag/${encodeURIComponent(tag.slug)}`}
      >
        #{tag.tagname}
      </CustomLink>
    </StyledSpan>))

  return (
    <StyledCard>
      <Row gutter={16} style={{ flexWrap: "nowrap" }} >
        {/* left sider: show avatar or tag */}
        <Col >
          <CustomLink
            href="/profile/[pid]"
            as={`/profile/${encodeURIComponent(article.author?.username)}`}
            className="author"
          >
            {!article.articleState && <Avatar src={article.author.image} size={40} />}
          </CustomLink>
          {article.articleState === 'draft' && <StyledTag>Draft</StyledTag>}
          {article.articleState === 'review' && <StyledTag>Review</StyledTag>}
        </Col>

        <Col style={{ flex: "auto" }}>
          {/* middle: show three information lines */}
          <TitleDiv>

            {article.title}
          </TitleDiv>
          <TagsDiv>
            <Space>{tags}</Space>
          </TagsDiv>
          {!article.articleState &&
            <CustomLink
              href="/profile/[pid]"
              as={`/profile/${encodeURIComponent(article.author?.username)}`}
              className="author"
            >
              <AuthDiv><span>{article.author.username + "・" + article.createdAt}</span></AuthDiv>
            </CustomLink>
          }

          <StatDiv>
            {/* left bottom: show author avatar or icons */}
            <Col style={{ marginTop: "1em" }}>
              {article.articleState && article.articleState !== "draft" &&
                <User
                  name={article.author.name}
                  image={article.author.image}
                  avatarSize={"20"}
                  emptySubtitle={true}
                />
              }
              {!article.articleState &&
                <Space size={"large"}>
                  <Twemoji options={{ className: 'twemoji' }}>
                    <StyledEmoji>{"❤️ " + article.favoritesCount}</StyledEmoji>
                    <StyledEmoji>{"💬 " + article.commentsCount}</StyledEmoji>
                  </Twemoji>
                </Space>
              }
            </Col>

            {/* rigt bottom: show two buttons */}
            <Col>
              <Button
                disabled={!article.articleState}
                onClick={onLeftButtonClick}
                style={{
                  border: "none",
                  background: "inherit"
                }}
              >
                {
                  !article.articleState ? (article.readtime && article.readtime + ' min read') :
                    article.articleState === 'published' ? 'Reject' : 'Delete'
                }
              </Button>
              <Button
                type={"primary"}
                onClick={onRightButtonClick}
                style={{
                  fontWeight: 'bold',
                  borderRadius: "0.5em",
                  background: article.articleState === 'published' ? '#4EC700' : '#007BED',
                  borderColor: article.articleState === 'published' ? '#4EC700' : '#007BED',
                }}
              >
                {
                  !article.articleState ? 'BookMark' :
                    article.articleState === 'published' ? 'Published' : 'Edit'
                }
              </Button>
            </Col>
          </StatDiv>
        </Col>
      </Row>
    </StyledCard>
  )
}


export default ArticleCard

