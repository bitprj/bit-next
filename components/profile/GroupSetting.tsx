import React from 'react';
import styled from 'styled-components'
import { Row, Col, Card, Avatar, Button, Space, Layout, Typography, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const { Search } = Input;

const GroupSetting = props => {

  return(
    <Layout>
      <Content>
        <Row gutter={40}>
            <Col>
              <Row>
                <Title level={4}>Org Profile Pic</Title>
              </Row>
              <Row>
                <Avatar />
              </Row>
              <Row>
                <Button type="primary">reupload dat pic nowish</Button>
              </Row>
              <Row>
                <Title level={4}>Tag Slug</Title>
              </Row>
              <Row>
              <Search
                placeholder="change dat slug"
                enterButton="edit"
                onSearch={value => console.log(value)}
              />
              </Row>
            </Col>

            <Col>
              <Title level={4}>Org Description</Title>
              <Form>
                <Form.Item>
                  <TextArea placeholder="Org Description here" autoSize={{ minRows: 4, maxRows: 7 }}/>
                  <Button type="primary">Edit dat description</Button>
                </Form.Item>
              </Form>
            </Col>

        </Row>

        <Row>
          <Title level={4}>Mod Settings</Title>
        </Row>
        <Row>
          <Button type="primary">
            Public
          </Button>
          <Button type="primary">
            Moderated
          </Button>
          <Button type="primary">
            Private
          </Button>
        </Row>
      </Content>
    </Layout>
  )
}

export default GroupSetting
