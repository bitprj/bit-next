import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, trigger } from "swr";
import { Row, Col,Tabs } from 'antd';

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
import FollowerList from "../../components/global/FollowerList";
import Tab_list from "../../components/profile/Tab_list";
import AccountSettings from "../../components/profile/AccountSettings";

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
  const [list,setList] = React.useState(["Posts","Followers","Following","Account Settings"])
  const [tab_select_list,setTabList] = React.useState(["Most Viewed","Most Liked","Most Recent"])
  const [isPosts,setPostsPage]= React.useState(true)
  const [isFollowers,setFollowersPage] = React.useState(false)
  const [isFollowings,setFollowingsPage] = React.useState(false)
  const [isTag,setTagPage] = React.useState(false)
  const [isSettings,setSettingsPage] = React.useState(false)
  const [followersList,setFollowersList] = React.useState(null)
  const [followingsList,setFollowingsList] = React.useState(null)

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const isUser = currentUser && username === currentUser?.username;
  const {TabPane} = Tabs;

  const Followers = () => {
    const response = UserAPI.followers(pid)
    setFollowersList(response)
  }
  const Followings=()=>{
    const response = UserAPI.followings(pid)
    setFollowingsList(response)
  }
  const TabChange = (key) =>{
    if(key=="Posts"){
      setTabList(["Most Viewed","Most Liked","Most Recent"])
      setPostsPage(true)
      setFollowersPage(false)
      setFollowingsPage(false)
      setTagPage(false)
      setSettingsPage(false)
    }
    else if(key=="Followers"){
      setTabList(["Old -> New","New -> Old"])
      setPostsPage(false)
      setFollowersPage(true)
      setFollowingsPage(false)
      setTagPage(false)
      setSettingsPage(false)
      Followers()
    }
    else if(key=="Following"){
      setTabList(["Old -> New","New -> Old"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(true)
      setTagPage(false)
      setSettingsPage(false)
      Followings()
    }
    else if(key=="Account Settings"){
      setTabList(["Settings","Organization","API Keys"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(false)
      setTagPage(false)
      setSettingsPage(true)
    }
    else{
      setTabList(["Most Viewed","Most Liked","Most Recent"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(false)
      setTagPage(true)
      setSettingsPage(false)
    }
  }
  const TabView = (key)=>{
  }

  if(isUser){
    return (
      <Row gutter={16} style={{marginTop:"7%",marginLeft:"0",marginRight:"0"}}>
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
        <Col span={12}>
          <Row gutter={[16, 40]}>
          <Col span={24}>
            <Tab_list tabs={tab_select_list} onClick={key=>TabView(key)} position={"top"}/>
          </Col>
          <Col span={24} style={{paddingTop:"0"}}>
            {isPosts?<ArticleList/>:null}
            {isFollowers?<FollowerList followers={followersList}/>:null}
            {isFollowings?<FollowerList followers={followingsList}/>:null}
            {isTag?<ArticleList/>:null}
            {isSettings?<AccountSettings/>:null}
          </Col>
          </Row>
        </Col>
        <Col span={3}>
          {isSettings?<p style={{opacity:"0.7",marginTop:"16px",fontSize:"18px"}}>Live Website</p>:null}
        </Col>
      </Row>
    );
  }
  else{
    return(<div></div>)
  }
};

Profile.getInitialProps = async ({ query: { pid } }) => {
  const { data: initialProfile } = await UserAPI.get(pid);
  return { initialProfile };
};

export default Profile;