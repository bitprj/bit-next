import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, trigger } from "swr";
import { Row, Col } from 'antd';

import ArticleList from "../../components/article/ArticleList";
import CustomImage from "../../components/common/CustomImage";
import ErrorMessage from "../../components/common/ErrorMessage";
import Maybe from "../../components/common/Maybe";
import EditProfileButton from "../../components/profile/EditProfileButton";
import FollowUserButton from "../../components/profile/FollowUserButton";
import ProfileTab from "../../components/profile/ProfileTab";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import User from "../../components/global/User";
import Tab_list from "../../components/profile/Tab_list";

const Profile = ({ initialProfile }) => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const {
    data: fetchedProfile,
    error: profileError,
  } = useSWR(
    `${SERVER_BASE_URL}/profiles/${encodeURIComponent(String(pid))}`,
    fetcher,
    { initialData: initialProfile }
  );

  if (profileError) return <ErrorMessage message="Can't load profile" />;

  const { profile } = fetchedProfile || initialProfile;
  const { username, bio, image, following } = profile;
  const [list,setList] = React.useState(["Posts","Followers","Following"])
  const [tab_select_list,setTabList] = React.useState(["Most Viewed","Most Liked","Most Recent"])

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const isUser = currentUser && username === currentUser?.username;

  const handleFollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: true } },
      false
    );
    UserAPI.follow(pid);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}`);
  };

  const handleUnfollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: true } },
      true
    );
    UserAPI.unfollow(pid);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}`);
  };

  const Followers = () => {
    const followers = UserAPI.followers(`${pid}`)
    console.log(followers)
  }
  const Followings=()=>{
    const followings = UserAPI.following(`${pid}`)
    console.log(followings)
  }
  const TabChange = (key) =>{
    if(key=="Posts"){
      setTabList(["Most Viewed","Most Liked","Most Recent"])
    }
    else{
      setTabList(["Old -> New","New -> Old"])
    }
  }
  const TabView = (key)=>{
  }

  return (
    <Row gutter={16} style={{marginTop:"3%",marginLeft:"0",marginRight:"0"}}>
      <Col span={2}></Col>
      <Col className="gutter-row" span={4}>
      <Row gutter={[16, 40]}>
        <Col span={24}>
          <User name={username} img={image} username={username}/>
        </Col>
        <Col span={24}>
        <Tab_list tabs={list} onClick={key=>TabChange(key)} position={"left"}/>
        </Col>
      </Row>
      </Col>
      <Col span={16}>
        <Row gutter={[16, 40]}>
        <Col span={24}>
          <Tab_list tabs={tab_select_list} onClick={key=>TabView(key)} position={"top"}/>
        </Col>
        </Row>
      </Col>
      <Col span={2}>
      </Col>
    </Row>
  );
};

Profile.getInitialProps = async ({ query: { pid } }) => {
  const { data: initialProfile } = await UserAPI.get(pid);
  return { initialProfile };
};

export default Profile;
