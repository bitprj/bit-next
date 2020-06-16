import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

import { Avatar, Row, Col, Input, Form, Button, message } from 'antd';

const { TextArea } = Input;

const StyledInput = styled(Input)`
`;

const StyledButton = styled.button`
  border-radius: 0px 5px 5px 0px;
  border: none;
  background: black;
  color: white;
  padding: 2%;
`;

const SettingsForm = () => {
  const [errors, setErrors] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    username: "",
    bio: "",
    password: "",
    image: "",
    githubLink: "",
    twitterLink: "",
    website: "",
    linkedinLink: "",
    token: "",
    createdAt: "",
    updatedAt: ""
  });
  const [form] = Form.useForm();
  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);

  React.useEffect(() => {
    if (!isLoggedIn) return;
    setUserInfo({ ...userInfo, ...currentUser });
  }, []);

  const updateState = (field) => ((e) => {
    const state = userInfo;
    const newState = { ...state, [field]: e.target.value };
    setUserInfo(newState);
  });

  const submitForm = async () => {
    const user = { ...userInfo };

    user.createdAt ? delete user.createdAt : null;
    user.updatedAt ? delete user.updatedAt : null;
    user.password === "" ? delete user.password : null;

    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/user`,
      JSON.stringify({ user: {user} }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Authorization": `Token ${encodeURIComponent(currentUser?.token)}`,
        },
      }
    );

    status !== 200 ? setErrors(data.errors.body) : null;

    if (data?.user) {
      window.localStorage.setItem("user", JSON.stringify(data.user));
      mutate("user", data.user);
    }
    if(status===200){
      message.success("Account Settings were Updated")
    }
  };

  const Reupload = async (value) => {
    const files = value.target.files
    const data_img = new FormData();
    data_img.append("file", files[0]);
    data_img.append("upload_preset", 'upload')
    const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/upload", {
      method: 'POST',
      body: data_img
    });
    const response = await res.json();
    const state = userInfo;
    const newState = { ...state, 'image': response.secure_url };
    const user = { ...newState };

    user.token || user.token === "" ? delete user.token : null;
    user.createdAt ? delete user.createdAt : null;
    user.updatedAt ? delete user.updatedAt : null;
    user.password === "" ? delete user.password : null;

    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/user`,
      JSON.stringify({ user:{user} }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Token ${currentUser?.token}`,
        },
      }
    );

    if (status !== 200) {
      setErrors(data.errors.body);
    }

    if (data?.user) {
      window.localStorage.setItem("user", JSON.stringify(data.user));
      mutate("user", data.user);
    }
    setUserInfo(newState);
    if(status===200){
      message.success("User Profile Image was Updated")
    }
    else{
      message.error("There was some error in updating. Please try again later.")
    }
  }

  return (
    <React.Fragment>
      <Row style={{marginLeft:'2%'}}>
          <Col span={24}>
            <Form
              layout="horizontal"
              onFinish={submitForm}
              initialValues={{Username:currentUser.username,Email:currentUser.email}}
              form={form}
            >
              <Form.Item label="User Profile">
                <Avatar src={userInfo.image} size={40} />
                <label style={{ color: "black",marginLeft:"1em" }}>Reupload Image<input style={{ display: "none" }} type="file" onChange={Reupload} /></label>
              </Form.Item>
              <Form.Item label="Github" name="Github">
                <StyledInput value={userInfo.githubLink} placeholder={"www.github.com"} onChange={updateState("githubLink")} />
              </Form.Item>
              <Form.Item label="Twitter">
                <StyledInput value={userInfo.twitterLink} placeholder={"www.twitter.com"} onChange={updateState("twitterLink")} />
              </Form.Item>
              <Form.Item label="LinkedIn">
                <StyledInput value={userInfo.linkedinLink} placeholder={"www.linkedin.com"} onChange={updateState("linkedinLink")} />
              </Form.Item>
              <Form.Item label="Personal Website">
                <StyledInput value={userInfo.website} placeholder={"www.example.com"} onChange={updateState("website")} />
              </Form.Item>
              <Form.Item label="Username" name="Username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <StyledInput value={userInfo.username} placeholder={"Username"} onChange={updateState("username")} />
              </Form.Item>
              <Form.Item label="Email" name="Email" rules={[{type: 'email',message: 'The input is not valid E-mail!'},{required: true,message: 'Please input your E-mail!'}]}>
                <StyledInput value={userInfo.email} placeholder={"Email"} onChange={updateState("email")} />
              </Form.Item>
              <Form.Item label="Password">
                <StyledInput.Password placeholder={"New Password"} onChange={updateState("password")} />
              </Form.Item>
              <Form.Item label="Your Bio">
                <TextArea
                  className="form-control form-control-lg"
                  rows={6}
                  placeholder="Short bio about you"
                  value={userInfo.bio}
                  onChange={updateState("bio")}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "black", width: "100%", fontSize: "12px",border:"none"}}
                >
                  edit
              </Button>
              </Form.Item>
            </Form>
          </Col>
      </Row>
    </React.Fragment>
  );
};

export default SettingsForm;