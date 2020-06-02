import axios from "axios";
import Router from "next/router";
import React from "react";
import useSWR, { mutate } from "swr";
import { Avatar,Row,Col,Typography,Input } from 'antd';

import ListErrors from "../common/ListErrors";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import storage from "../../lib/utils/storage";

const SettingsForm = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
    github:"",
    twitter:"",
    website:"",
    linkedIn:"",
  });
  const { Text } = Typography;
  const textStyle={
    background:"black",
    color:"white",
    padding:"2%",
    borderBottomRightRadius:"10px",
    borderTopRightRadius:"10px",
    border:"none"
  };

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
    if (!user.password) {
      delete user.password;
    }

    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/user`,
      JSON.stringify({ user }),
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
  };
  const Reupload = async (value) =>{
    const files= value.target.files
    const data_img = new FormData();
    data_img.append("file",files[0]);
      data_img.append("upload_preset", 'upload')
      const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/upload",{
          method:'POST',
          body: data_img
    });
    const response = await res.json();
    const state = userInfo;
    const newState = { ...state, 'image': response.secure_url };
    const user = { ...newState };
    if (!user.password) {
      delete user.password;
    }

    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/user`,
      JSON.stringify({ user }),
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
                <Avatar src= {userInfo.image} size = {50}/>
                <br/>
                <br/>
                <label style={{color:"black"}}>Reupload Image<input style={{display:"none"}} type="file" onChange={Reupload}/></label>
              </Col>
              <br/>
              <Col span={24}>
              <h6>Github</h6>
              <Text style={{background:"white",padding:"2%"}}>{userInfo.github || "www.github.com"}</Text><Text style={textStyle}>verified</Text>
              </Col>
              <br/>
              <Col span={24}>
              <h6>Twitter</h6>
              <Text style={{background:"white",padding:"2%"}}>{userInfo.twitter || "www.twitter.com"}</Text><Text style={textStyle}>verified</Text>
              </Col>
              <br/>
              <Col span={24}>
              <h6>LinkedIn</h6>
              <Text style={{background:"white",padding:"2%"}}>{userInfo.linkedIn || "www.linkedin.com"}</Text><Text style={textStyle}>verified</Text>
              </Col>
              <br/>
              <Col span={24}>
              <h6>Personal Website</h6>
              <Input type="text" style={{background:"white",padding:"2%",width:"50%"}} onChange={updateState("website")} defaultValue={userInfo.website} placeholder={"www.example.com"}/><button style={textStyle} onClick={submitForm}>edit</button>
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
          <br/>
          <Col span={24}>
          <button
            className="btn btn-lg btn-primary"
            style={{background:"black",width:"100%",fontSize:"12px",padding:"2%"}}
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