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

const Styledlabel = styled.label`
  color:#555555;
  &:hover{
    color:#000000;
    cursor:pointer;
  }
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
    occupation:"",
    name:"",
    location:""
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
    user.image===null ? delete user.image:null;
    user.twitterLink===null ? delete user.twitterLink:null;
    user.githubLink===null ? delete user.githubLink:null;
    user.website===null ? delete user.website:null;
    user.linkedinLink===null ? delete user.linkedinLink:null;
    user.occupation===null ? delete user.occupation:null;
    user.bio===null ? delete user.bio:null;
    user.name===null? delete user.name:null;
    user.location===null? delete user.location:null;

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
    if(status===200){
      message.success("Account Settings were Updated")
    }
    else{
      message.error("There was some error in updating. Please try again later.")
    }
  };

  const Reupload = async (value) => {
    const files = value.target.files
    if(files.length>0){
      if(files[0].type.split("/")[0]=="image"){
        if(files[0].size<2097153){
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
          user.image===null ? delete user.image:null;
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
          if(status===200){
            message.success("User Profile Image was Updated")
          }
          else{
            message.error("There was some error in updating. Please try again later.")
          }
        }
        else{
          message.warning("File Size Error: Please Upload Image less than 2MB")
        }
      }
      else{
        message.warning("File Type Error: Please Upload an Image File")
      }
    }
  }

  return (
    <React.Fragment>
      <Row style={{marginLeft:'2%'}}>
          <Col span={24}>
            <Form
              layout="horizontal"
              onFinish={submitForm}
              initialValues={{Username:currentUser.username,Email:currentUser.email,Github:currentUser.githubLink,Twitter:currentUser.twitterLink,LinkedIn:currentUser.linkedinLink,Website:currentUser.website,Name:currentUser.name,Location:currentUser.location,Occupation:currentUser.occupation}}
              form={form}
            >
              <Form.Item label="User Profile">
                <Avatar src={userInfo.image} size={40} />
                <Styledlabel style={{ marginLeft:"1em" }}>Reupload Image<input style={{ display: "none" }} type="file" onChange={Reupload} /></Styledlabel>
              </Form.Item>
              <Form.Item label="Name" name="Name">
                <StyledInput value={userInfo.name} placeholder={"Name"} onChange={updateState("name")} />
              </Form.Item>
              <Form.Item label="Github" name="Github" rules={[{type:'url', message: 'Please enter valid url'}]}>
                <StyledInput value={userInfo.githubLink} placeholder={"http://www.github.com"} onChange={updateState("githubLink")} />
              </Form.Item>
              <Form.Item label="Twitter" name="Twitter" rules={[{type:'url', message: 'Please enter valid url'}]}>
                <StyledInput value={userInfo.twitterLink} placeholder={"http://www.twitter.com"} onChange={updateState("twitterLink")} />
              </Form.Item>
              <Form.Item label="LinkedIn" name="LinkedIn" rules={[{type:'url', message: 'Please enter valid url'}]}>
                <StyledInput value={userInfo.linkedinLink} placeholder={"http://www.linkedin.com"} onChange={updateState("linkedinLink")} />
              </Form.Item>
              <Form.Item label="Personal Website" name="Website" rules={[{type:'url', message: 'Please enter valid url'}]}>
                <StyledInput value={userInfo.website} placeholder={"http://www.example.com"} onChange={updateState("website")} />
              </Form.Item>
              <Form.Item label="Location" name="Location">
                <StyledInput value={userInfo.location} placeholder={"Location"} onChange={updateState("location")} />
              </Form.Item>
              <Form.Item label="Occupation" name="Occupation">
                <StyledInput value={userInfo.occupation} placeholder={"Occupation"} onChange={updateState("occupation")} />
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