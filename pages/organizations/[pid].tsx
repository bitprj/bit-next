import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, trigger } from "swr";
import styled from 'styled-components';

import ErrorMessage from "../../components/common/ErrorMessage";
import ArticleList from "../../components/article/ArticleList";
import FollowList from "../../components/global/FollowList";
import OrganizationsAPI from "../../lib/api/organizations";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import Header from "../../components/global/Header"
import { Tabs } from 'antd';
import UserList from '../../components/global/UserList'

const { TabPane } = Tabs;

const StyledDiv = styled.div`
  padding-top: 3em;
`

const Organization = () => {
  const router = useRouter();
  const {query: { pid }} = router;

  const {
    data: fetchedOrganization,
    error: organizationError,
  } = useSWR(
    `${SERVER_BASE_URL}/organizations/${encodeURIComponent(String(pid))}`,
    fetcher,
  );

  if (!fetchedOrganization) return <h1>Loading...</h1>;
  if (organizationError) return <ErrorMessage message="Can't load organization" />;

  const { organization } = fetchedOrganization ;
  if (!organization) return <ErrorMessage message="Can't load organization" />;

  const { name, description, image, is_following, createdAt, moderators, members} = organization;
  const OrganizationUser = {
      'name': name,
      'username': name,
      'image': image,
      'bio':description,
      'following': is_following,
      'joined': createdAt.slice(0, 10),
  }
  const handleFollow = async () => {
    OrganizationsAPI.follow(pid);
    mutate(
      `${SERVER_BASE_URL}/organizations/${pid}`,
      { organization: { ...organization, is_following: true } },
      true
    );
    // trigger(`${SERVER_BASE_URL}/organizations/${pid}`);
  };

  const handleUnfollow = async () => {
    OrganizationsAPI.unfollow(pid);
    mutate(
      `${SERVER_BASE_URL}/organizations/${pid}`,
      { organization: { ...organization, is_following: false } },
      true
    );
    // trigger(`${SERVER_BASE_URL}/organizations/${pid}`);
  };

  return (
    <div className="container page">
      <StyledDiv>
            <div className="row">
              <div className="col-xs-12 col-md-12 ">
                <Header
                  user={OrganizationUser}
                  follow={handleFollow}
                  unfollow={handleUnfollow}
                />
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <Tabs defaultActiveKey="1" style={{flex:3}}>
                    <TabPane key="1" tab={"Posts"}>
                      <ArticleList />
                    </TabPane>
                    <TabPane key="2" tab={"Followers"}>
                      <FollowList followings={false} pageName={"organizations"}/>
                    </TabPane>
                  </Tabs>
                  <div style={{flex:1, padding:"0em 2em 0em 8em"}}>
                    <UserList header='Moderator' users = {moderators}/>
                    <div style={{marginTop:"2em"}}>
                      <UserList header='Members' users = {members}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </StyledDiv>
    </div>
  );
}

// Organization.getInitialProps = async ({ query: { pid } }) => {
//     const { data: initialOrganization } = await OrganizationsAPI.get(pid);
//     return { initialOrganization };
// };


export default Organization;