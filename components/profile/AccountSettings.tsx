import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

import { Avatar, Row, Col, Input } from 'antd';

const StyledInput = styled(Input)`
  width: 12em;
  border: none;
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
      JSON.stringify({ user: user }),
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
  }

  return (
    <React.Fragment>
      <Row>
        <Col span={12}>
          <Col span={24}>
            <h6>User Profile</h6>
            <Avatar src={userInfo.image} size={50} />
            <br />
            <br />
            <label style={{ color: "black" }}>Reupload Image<input style={{ display: "none" }} type="file" onChange={Reupload} /></label>
          </Col>
          <br />
          <Col span={24}>
            <h6>Github</h6>
            <StyledInput placeholder={userInfo.githubLink || "www.github.com"} onChange={updateState("githubLink")} />
          </Col>
          <br />
          <Col span={24}>
            <h6>Twitter</h6>
            <StyledInput placeholder={userInfo.twitterLink || "www.twitter.com"} onChange={updateState("twitterLink")} />
          </Col>
          <br />
          <Col span={24}>
            <h6>LinkedIn</h6>
            <StyledInput placeholder={userInfo.linkedinLink || "www.linkedin.com"} onChange={updateState("linkedinLink")} />
          </Col>
          <br />
          <Col span={24}>
            <h6>Personal Website</h6>
            <StyledInput placeholder={userInfo.website || "www.example.com"} onChange={updateState("website")} />
            <StyledButton onClick={submitForm}>edit</StyledButton>
          </Col>
        </Col>
        <Col span={12}>
          <Col span={24}>
            <h6>Your Bio</h6>
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              value={userInfo.bio}
              onChange={updateState("bio")}
            />
          </Col>
          <br />
          <Col span={24}>
            <button
              className="btn btn-lg btn-primary"
              style={{ background: "black", width: "100%", fontSize: "12px", padding: "2%" }}
              onClick={submitForm}
            >
              edit
          </button>
          </Col>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SettingsForm;