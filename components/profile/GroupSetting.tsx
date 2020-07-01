import React from 'react';
import styled from 'styled-components'
import { Row, Col, Card, Avatar, Button,
   Space, Layout, Typography, Form,
   Input, Upload, Message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserAPI from "../../lib/api/user";
import OrganizationsAPI from "../../lib/api/organizations";
import TagAPI from "../../lib/api/tag";

import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const { Search } = Input;

const StyledCard = styled(Card)`
  margin-right: 20px
`

const GroupSetting = ({ currentOrg = null, currentTag = null, page }) => {

  const {
    data: tagOrg,
    error: tagOrgError,
  } = currentOrg ? useSWR(`${SERVER_BASE_URL}/organizations/${currentOrg}`, fetcher) :
      useSWR(`${SERVER_BASE_URL}/tags/${currentTag}`, fetcher)

  {/*returns description: etc*/}
  const editDescription = description => {
    if (currentOrg) {
      const description = description.description;
      OrganizationsAPI.changeOrgDescription(currentOrg, description)
    } else {
      TagAPI.changeTagDescription(currentTag, description)
    }
  }

  const uploadPic = pic => {
    if (currentOrg) {
      OrganizationsAPI.changeOrgPic(pic)
    } else {
      TagAPI.changeTagPic(pic)
    }
  }

  {/*returns string*/}
  const changeSlug = slug => {
    if (currentOrg) {
      OrganizationsAPI.changeOrgSlug(currentOrg, slug)
    } else {
      TagAPI.changeTagSlug(currentTag, slug)
    }
  }

  {/*returns number*/}
  const editModSettings = setting => {
    if (currentOrg) {
      OrganizationsAPI.changeModSettingOrg(currentOrg, setting)
    } else {
      TagAPI.changeModSettingTag(currentTag, setting)
    }
  }

  if (tagOrg) {
    return (
      <>
        <Row>
          <Col>
            <Row gutter={40}>
              <Col>
                <Row>
                  <Title level={4}>{currentOrg ? "Org Profile Pic" : "Tag Profile Pic"}</Title>
                </Row>
                <Row>
                  <Avatar src={currentOrg ? tagOrg.organization.image : tagOrg.tag.icon} style={{ margin: "0px 42px 10px" }} />
                </Row>
                <Row style={{ margin: "0px 0px 15px" }}>
                  <Upload customRequest={uploadPic} showUploadList={false}>
                    <Button type="primary" >Reupload Icon</Button>
                  </Upload>
                </Row>
                <Row>
                  <Title level={4}>{currentOrg ? "Org Slug" : "Tag Slug"}</Title>
                </Row>
                <Row style={{ margin: "0px 0px 15px" }}>
                  <Search
                    placeholder={currentOrg ? currentOrg : currentTag}
                    defaultValue={currentOrg ? currentOrg : currentTag}
                    addonBefore="bitproject.org/"
                    enterButton="edit"
                    onSearch={value => changeSlug(value)}
                  />
                </Row>
              </Col>

              <Col>
                <Title level={4}>{currentOrg ? "Org Description" : "Tag Description"}</Title>
                <Form onFinish={editDescription}
                  initialValues={{
                    description: currentOrg ? tagOrg.organization.description : tagOrg.tag.description
                  }}>
                  <Form.Item name="description">
                    <TextArea
                      placeholder="Org Description here"
                      autoSize={{ minRows: 4, maxRows: 6 }} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>{currentOrg ? "Edit Org Description" : "Edit Tag Description"}</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>

            {currentTag ?
            <>
            <Row>
              <Title level={4}>Mod Settings</Title>
            </Row>
            <Row style={{ justifyContent: 'space-between' }}>
              <Col span={8}>
                <Button size="large" onClick={() => editModSettings(1)} type="primary">
                  Public
                </Button>
                <StyledCard>Writers can directly post on tag.</StyledCard>
              </Col>
              <Col span={8}>
                <Button size="large" onClick={() => editModSettings(2)} type="primary">
                  Moderated
                </Button>
                <StyledCard>Moderators allow posts on the tag.</StyledCard>
              </Col>
              <Col span={8}>
                <Button size="large" onClick={() => editModSettings(3)} type="primary">
                  Private
                </Button>
                <StyledCard>Only moderators can post on the tag. Fit for internal tags.</StyledCard>
              </Col>
            </Row>
            </>
            : null}
          </Col>
        </Row>
      </>
    )
  } else {
    return (<div></div>)
  }
}

export default GroupSetting
