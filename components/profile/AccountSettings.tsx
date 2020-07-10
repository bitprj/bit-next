import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import FormItem from "./Form_Items";
import { Avatar, Row, Col, Input, Form, Button, message } from 'antd';

const { TextArea } = Input;

const StyledInput = styled(Input)`
`;

const StyledButton = styled(Button)`
  width: 100%;
  fontSize: 12px;
  border: none;
  background: black !important;
  &:hover{
    background: black;
  }
`;

const Styledlabel = styled.label`
  color:#555555;
  margin-left: 1em;
  &:hover{
    color:#000000;
    cursor:pointer;
  }
`;

const StyledRow = styled(Row)`
  margin-left: 2%;
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
    updatedAt: "",
    occupation: "",
    name: "",
    location: ""
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
    user.image === null ? delete user.image : null;
    user.twitterLink === null ? delete user.twitterLink : null;
    user.githubLink === null ? delete user.githubLink : null;
    user.website === null ? delete user.website : null;
    user.linkedinLink === null ? delete user.linkedinLink : null;
    user.occupation === null ? delete user.occupation : null;
    user.bio === null ? delete user.bio : null;
    user.name === null ? delete user.name : null;
    user.location === null ? delete user.location : null;

    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/user`,
      JSON.stringify({ user }),
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
    if (status === 200) {
      message.success("Account Settings were Updated")
    }
    else {
      message.error("There was some error in updating. Please try again later.")
    }
  };

  const Reupload = async (value) => {
    const files = value.target.files
    if (files.length > 0) {
      if (files[0].type.split("/")[0] == "image") {
        if (files[0].size < 2097153) {
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

          user.createdAt ? delete user.createdAt : null;
          user.updatedAt ? delete user.updatedAt : null;
          user.password === "" ? delete user.password : null;
          user.image === null ? delete user.image : null;
          delete user.twitterLink;
          delete user.githubLink;
          delete user.website;
          delete user.linkedinLink;
          delete user.occupation;
          delete user.bio;
          delete user.name;
          delete user.location;

          const { data, status } = await axios.put(
            `${SERVER_BASE_URL}/user`,
            JSON.stringify({ user }),
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
          if (status === 200) {
            message.success("User Profile Image was Updated")
          }
          else {
            message.error("There was some error in updating. Please try again later.")
          }
        }
        else {
          message.warning("File Size Error: Please Upload Image less than 2MB")
        }
      }
      else {
        message.warning("File Type Error: Please Upload an Image File")
      }
    }
  }

  return (
    <React.Fragment>
      <StyledRow>
        <Col span={24}>
          <Form
            layout="horizontal"
            onFinish={submitForm}
            initialValues={{ Username: currentUser.username, Email: currentUser.email, Github: currentUser.githubLink, Twitter: currentUser.twitterLink, LinkedIn: currentUser.linkedinLink, Website: currentUser.website, Name: currentUser.name, Location: currentUser.location, Occupation: currentUser.occupation }}
            form={form}
          >
            <Form.Item label="User Profile">
              <Avatar src={userInfo.image} size={40} />
              <Styledlabel>Reupload Image<input style={{ display: "none" }} type="file" onChange={Reupload} /></Styledlabel>
            </Form.Item>
            <FormItem onChange={updateState("name")} label={"Name"} name={"Name"} rules={[]} placeholder={"Name"}/>
            <FormItem onChange={updateState("githubLink")} label={"Github"} name={"Github"} rules={[{ type: 'url', message: 'Please enter valid url' }]} placeholder={"http://www.github.com"}/>
            <FormItem onChange={updateState("twitterLink")} label={"Twitter"} name={"Twitter"} rules={[{ type: 'url', message: 'Please enter valid url' }]} placeholder={"http://www.twitter.com"}/>
            <FormItem onChange={updateState("linkedinLink")} label={"LinkedIn"} name={"LinkedIn"} rules={[{ type: 'url', message: 'Please enter valid url' }]} placeholder={"http://www.linkedin.com"}/>
            <FormItem onChange={updateState("website")} label={"Personal Website"} name={"Website"} rules={[{ type: 'url', message: 'Please enter valid url' }]} placeholder={"http://www.example.com"}/>
            <FormItem onChange={updateState("location")} label={"Location"} name={"Location"} rules={[]} placeholder={"Location"}/>
            <FormItem onChange={updateState("occupation")} label={"Occupation"} name={"Occupation"} rules={[]} placeholder={"Occupation"}/>
            <FormItem onChange={updateState("username")} label={"Username"} name={"Username"} rules={[{ required: true, message: 'Please input your username!' }]} placeholder={"Username"}/>
            <FormItem onChange={updateState("email")} label={"Email"} name={"Email"} rules={[{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]} placeholder={"Email"}/>
            <FormItem onChange={updateState("password")} label={"Password"} name={"Password"} rules={[]} placeholder={"New Password"}/>
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
              <StyledButton
                type="primary"
                htmlType="submit"
              >
                edit
              </StyledButton>
            </Form.Item>
          </Form>
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default SettingsForm;