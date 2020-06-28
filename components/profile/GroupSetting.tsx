import React from 'react';
import styled from 'styled-components'
import { Row, Col, Card, Avatar, Button, Space, Layout, Typography, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserAPI from "../../lib/api/user";

import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const { Search } = Input;

const StyledButton = styled(Button)`
  margin: 0px 20px
`

const SettingButton = styled(Button)`
  height: 75px;
`

const GroupSetting = ({ currentOrg = null, currentTag = null, page }) => {

  const {
    data: tagOrg,
    error: tagOrgError,
  } = currentOrg ? useSWR(`${SERVER_BASE_URL}/organizations/${currentOrg}`, fetcher) :
      useSWR(`${SERVER_BASE_URL}/tags/${currentTag}`, fetcher)

  //if (tagOrg) { console.log(tagOrg.organization.description); }

  const editDescription = values => {
    console.log("The values are", values);
  }

  const uploadPic = () => {
    console.log("new pic please");
  }

  const editModSettings = (setting) => {
    if (currentOrg) {
      UserAPI.changeModSettingOrg(currentOrg, setting)
    } else {
      UserAPI.changeModSettingTag(currentTag, setting)
    }
  }

  if (tagOrg) {
    return (
      <>
        <Row gutter={40}>
          <Col>
            <Row>
              <Title level={4}>{currentOrg ? "Org Profile Pic" : "Tag Profile Pic"}</Title>
            </Row>
            <Row>
              <Avatar style={{ margin: "0px 0px 8px" }} />
            </Row>
            <Row style={{ margin: "0px 0px 15px" }}>
              <Button type="primary" onClick={() => uploadPic()}>Reupload Icon</Button>
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
                onSearch={value => console.log(value)}
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

        <Row>
          <Title level={4}>Mod Settings</Title>
        </Row>
        <Row>
          <Space>
            <SettingButton onClick={() => editModSettings(1)} type="primary">
              Public: <br /> Writers can directly post on tag
            </SettingButton>
            <SettingButton onClick={() => editModSettings(2)} type="primary">
              Moderated: <br /> Moderators allow posts on the tag
            </SettingButton>
            <SettingButton onClick={() => editModSettings(3)} type="primary">
              Private: <br /> Only moderators can post on the tag. <br /> Fit for internal tags
          </SettingButton>
          </Space>
        </Row>
      </>
    )
  } else {
    return(<div></div>)
  }
}

export default GroupSetting
