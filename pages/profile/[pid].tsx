import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, trigger } from "swr";
import { Row, Col,Tabs } from 'antd';

import ErrorMessage from "../../components/common/ErrorMessage";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import Header from "../../components/global/Header"
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding-top: 3em;
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
  const { username, email } = profile;

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);
  const isUser = currentUser && username === currentUser?.username;
  const {TabPane} = Tabs;

  const handleFollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: true } },
      true
    );
    UserAPI.follow(pid, email);
    trigger(`${SERVER_BASE_URL}/profiles/${pid}`);
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