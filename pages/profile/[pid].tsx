import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, trigger } from "swr";
import styled from 'styled-components';

import CustomImage from "../../components/common/CustomImage";
import ErrorMessage from "../../components/common/ErrorMessage";
import ArticleList from "../../components/article/ArticleList";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import Header from "../../components/global/Header"
import { Tabs } from 'antd';

const StyledDiv = styled.div`
  padding-top: 3em;
`

const StyledTabs = styled.div`

    .ant-tabs-nav::before {
      display: none;
    }

    .ant-tabs-tab-active {
      border-color: #000;
      background: #fff;
    }

`

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
  const { username, bio, image, following, email } = profile;
  const [Following_Button,setFollowing] = React.useState(following)
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

  const handleFollow = async () => {
    if(profile.following==false){
      setFollowing(true)
      mutate(
        `${SERVER_BASE_URL}/profiles/${pid}`,
        { profile: { ...profile, following: true } },
        false
      );
      UserAPI.follow(pid,email);
      trigger(`${SERVER_BASE_URL}/profiles/${pid}`);
    }
    else{
      setFollowing(false)
      handleUnfollow()
    }
  };

  const handleUnfollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: false } },
      true
    );
    UserAPI.unfollow(pid);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}`);
  };


  return (
    <StyledDiv>
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 ">
              <Header
                user={profile}
                follow={handleFollow}
                unfollow={handleUnfollow}
              />
              <StyledTabs>        
                <Tabs defaultActiveKey="1" size = {"large"}  type={"card"} tabBarGutter={32} >
                  <Tabs.TabPane key="1" tab={"Posts"}>
                      <ArticleList/>
                  </Tabs.TabPane>
                  <Tabs.TabPane key="2" tab={"Followers"}> 
                      Followers 
                  </Tabs.TabPane>
                  <Tabs.TabPane key="3" tab={"Following"}> 
                    Following 
                  </Tabs.TabPane>
                </Tabs>
              </StyledTabs> 
            </div>
          </div>
        </div>
      </div>
    </StyledDiv>
  );
};

Profile.getInitialProps = async ({ query: { pid } }) => {
  const { data: initialProfile } = await UserAPI.get(pid);
  return { initialProfile };
};

export default Profile;