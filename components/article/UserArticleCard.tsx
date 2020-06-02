import React from 'react';
import styled from 'styled-components'
import CustomLink from "../common/CustomLink";
import { Row, Col, Card, Avatar } from 'antd';


const StyledCard = styled(Card)`
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  background: #FFFFFF;
  width: 300px;
  border: 0.4em solid rgba(210, 210, 210, 0.2);
  border-radius: 0px 0px 0.5em 0.5em;
`
const TitleDiv = styled.div`
  font-size: 17px;
  line-height: 1.5em;
  color: #000000;
  margin-bottom:0.2em
`
const TagCol = styled(Col)`
  max-width: 66%;
`
const BottomDiv = styled(Row)`
  font-size: 1em;
  line-height: 0.8em;
  color: #707070;
  margin-top: 1em;
  display: flex;
  flex-flow: row wrap;
  justify-content : space-between;
  align-items: center;
`
const StyledTag = styled.span`
  line-height: 1.5em;
  margin-right: 1em;
`

const ArticleCard = (props) => {

  return (
    <StyledCard>
      <Row>
        <Col>
          <CustomLink
            href="/article/[pid]"
            as={`/article/${props.article.slug}`}
            className="preview-link"
          >
            <TitleDiv>{props.article.title}</TitleDiv>
          </CustomLink>
        </Col>
      </Row>
      <BottomDiv>
        <TagCol>
          <div>{props.article.tagList.map((tag, i) => (<StyledTag key={i}>{"#" + tag}</StyledTag>))}</div>
        </ TagCol>
        <Col>
          <Avatar src={props.article.author.image} size={50} />
        </ Col>
      </BottomDiv>
    </StyledCard>
  );
}

export default ArticleCard;