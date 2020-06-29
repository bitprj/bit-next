import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";

import GroupSetting from "../../components/profile/GroupSetting";
import ArticleList from "../../components/global/ArticleList";
import UserList from "../../components/global/UserList";
import ErrorMessage from "../../components/common/ErrorMessage";
import User from "../../components/global/User";
import FollowList from "../../components/global/FollowList";
import Tab_list from "../../components/profile/Tab_list";
import Menu_list from "../../components/profile/Menu_list";
import AccountSettings from "../../components/profile/AccountSettings";
import { Row, Col, Tabs, Menu, Divider } from 'antd';

import styled from "styled-components";
import AdminPanel from "../../components/profile/AdminPanel";


const StyledMenu = styled(Menu)`
	font-size: 15px;
	font-weight: bold;
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

  const {
    data: modTags,
    error: tagError,
  } = useSWR(`${SERVER_BASE_URL}/profiles/${encodeURIComponent(String(pid))}/tags`, fetcher)

  let tagsList = [];

  const { profile } = fetchedProfile || initialProfile;
  const { username, bio, image, following } = profile;
  let tabsList = []
  if (initialProfile.profile.isAdmin) {
    tabsList = ["Posts", "Followers", "Following", "Account Settings", "Admin"]
  } else {
    tabsList = ["Posts", "Followers", "Following", "Account Settings"]
  }
  const [list, setList] = React.useState(tabsList)
  const [tab_select_list, setTabList] = React.useState(["All Posts", "Published", "Drafts"])
  const [isPosts, setPostsPage] = React.useState(true)
  const [isFollowers, setFollowersPage] = React.useState(false)
  const [isFollowings, setFollowingsPage] = React.useState(false)
  const [isTag, setTagPage] = React.useState(false)
  const [isSettings, setSettingsPage] = React.useState(false)
  const [isAllArticles, setAllArticles] = React.useState(true);
  const [isPublished, setPublished] = React.useState(false);
  const [isDrafts, setDrafts] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const [subTags, setSubTags] = React.useState(false);
  const [pubTags, setPubTags] = React.useState(false);
  const [tagSettings, setTagSettings] = React.useState(false);
  const [tagsType, setTagsType] = React.useState("Submitted");
  const [currentTag, setTag] = React.useState(null);

  const [currentOrg, setOrg] = React.useState(null);
  const [isOrg, setOrgPage] = React.useState(false);
  const [isMembers, setMembers] = React.useState(false);
  const [isSubOrgs, setSubOrgs] = React.useState(false);
  const [isOrgSettings, setOrgSettings] = React.useState(false);

  const { data: currentUser } = useSWR("user", storage);
  const { data: fetchedArticles } = useSWR(`${SERVER_BASE_URL}/articles?author=${initialProfile.profile.username}`, fetcher);
  const { data: dropDownTags } = useSWR(`${SERVER_BASE_URL}/tags?quantity=all`, fetcher);

  const isLoggedIn = checkLogin(currentUser);
  const isUser = currentUser && username === currentUser ?.username;

  const [articleType, setArticleType] = React.useState("all");

  const [orgTagSettings, setOrgTagSettings] = React.useState(false);

	const [tabKey, setTabKey] = React.useState(null);

  {/*for article items/admin/everything not orgs and tags in menu*/ }
  const MenuChange = (key) => {
    setTagPage(false)
    setOrgPage(false)
    if (key == "Posts") {
      setTabList(["All Posts", "Published", "Drafts"])
      setPostsPage(true)
      setFollowersPage(false)
      setFollowingsPage(false)
      setSettingsPage(false)
      setIsAdmin(false)

			TabView("All Posts");
			setTabKey("All Posts");
    }
    else if (key == "Followers") {
      setTabList(["Old -> New"])
      setPostsPage(false)
      setFollowersPage(true)
      setFollowingsPage(false)
      setSettingsPage(false)
      setIsAdmin(false)
    }
    else if (key == "Following") {
      setTabList(["Old -> New"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(true)
      setSettingsPage(false)
      setIsAdmin(false)
    }
    else if (key == "Account Settings") {
      setTabList(["Settings", "Organization", "API Keys"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(false)
      setSettingsPage(true)
      setIsAdmin(false)
    }
    else if (key == "Admin") {
      setIsAdmin(true)
      setTabList(["Admin"])
      setPostsPage(false)
      setFollowersPage(false)
      setFollowingsPage(false)
      setSettingsPage(false)
    }
		setTabKey(tab_select_list[0]);
  }

  {/*for tag menu items*/ }
  const TagChange = (key) => {
    setPostsPage(false)
    setFollowersPage(false)
    setFollowingsPage(false)
    setSettingsPage(false)
    setIsAdmin(false)
    setOrgPage(false)

		setTabList(["Submitted", "Published", "Settings"])
		setTagPage(true);
    setTag(key);

		TabView("Submitted");
		setTabKey(tab_select_list[0]);
  }

  {/*for org menu items*/ }
  const OrgChange = (key) => {
    setPostsPage(false)
    setFollowersPage(false)
    setFollowingsPage(false)
    setSettingsPage(false)
    setIsAdmin(false)
    setTagPage(false);

    setTabList(["Submitted", "Members", "Settings"])
    setOrgPage(true);
    setOrg(key);

		TabView("Submitted");
		setTabKey(tab_select_list[0]);
  }

	{/*switching between top tabs*/}
  const TabView = (key) => {
		setTabKey(key);
    if (key == "All Posts") {
      setAllArticles(true);
      setDrafts(false);
      setPublished(false);

      setArticleType("all");
    }
    else if (key == "Published") {
      if (isPosts) {
        setAllArticles(false);
        setDrafts(false);
        setPublished(true);

        setArticleType("published");
      } else {
        setSubTags(false);
        setPubTags(true);
        setTagSettings(false);
      }
    }
    else if (key == "Drafts") {
      setAllArticles(false);
      setDrafts(true);
      setPublished(false);

      setArticleType("drafts");
    }
    else if (key == "Submitted") {
      if (isOrg) {
        setSubOrgs(true);
        setMembers(false);
        setOrgSettings(false);
      } else {
        setSubTags(true);
        setPubTags(false);
        setTagSettings(false);
      }
    }
    else if (key == "Settings") {
      if (isOrg) {
        setSubOrgs(false);
        setMembers(false);
        setOrgSettings(true);
      } else {
        setSubTags(false);
        setPubTags(false);
        setTagSettings(true);
      }
    }
    else if (key == "Members") {
      setSubOrgs(false);
      setMembers(true);
      setOrgSettings(false);
    }
    else {
      setAllArticles(false);
      setDrafts(false);
      setPublished(false);
    }
  }

  const {
    data: orgData,
    error: orgError,
  } = useSWR(
    `${SERVER_BASE_URL}/profile/organizations`,
    fetcher
  );

  let orgsMod = [];

  if (orgData) {
    for (let i = 0; i < orgData.organizations.length; i++) {
      for (let j = 0; j < orgData.organizations[i].moderators.length; j++) {
        if (orgData.organizations[i].moderators[j].profile.username == username) {
          orgsMod.push(orgData.organizations[i]);
        }
      }
    }
  }

	const {
		data: orgMembers,
		error: membersError,
	} = useSWR(
    `${SERVER_BASE_URL}/organizations/${currentOrg}/members`,
    fetcher
  );

	const {
		data: orgArticles,
		error: orgArticleError,
	} = useSWR(
		`${SERVER_BASE_URL}/organizations/${currentOrg}/articles`,
		fetcher
	);

  const {
    data: articleData,
    error: articleError,
  } = useSWR(
    `${SERVER_BASE_URL}/profile/articles?type=${encodeURIComponent(String(articleType))}`,
    fetcher
  );

  const {
    data: tagReviews,
    error: reviewsError,
  } = useSWR(
    `${SERVER_BASE_URL}/articles?tag=${encodeURIComponent(String(currentTag))}`,
    fetcher
  );

  let needsReview = [];
  let publishedTags = [];

  if (modTags) {
    for (let i = 0; i < modTags.tags.length; i++) {
      if (modTags.tags[i].moderator) {
        tagsList.push(modTags.tags[i]);
      }
    }
  }

  if (tagReviews) {
    for (let i = 0; i < tagReviews.articles.length; i++) {
      if (tagReviews.articles[i].needsReview) {
        needsReview.push(tagReviews.articles[i]);
      } else if (tagReviews.articles[i].isPublished) {
        publishedTags.push(tagReviews.articles[i]);
      }
    }
  }

  if (isUser) {

    return (
      <Row gutter={16} style={{ marginTop: "8em", marginLeft: "0", marginRight: "0" }}>
        <Col span={2}></Col>
        <Col className="gutter-row" span={4}>
          <Row gutter={[16, 40]}>
            <Col span={24}>
              <User name={username} image={image} username={username} />
            </Col>
            <Col span={24}>
              <StyledMenu>
                {list.map(item => <Menu.Item key={item} onClick={item => MenuChange(item.key)}>{item}</Menu.Item>)}
                <Menu.Divider />
                {orgsMod.map(item => <Menu.Item key={item.slug} onClick={item => OrgChange(item.key)}>{item.name}</Menu.Item>)}
                <Menu.Divider />
                {tagsList.map(item => <Menu.Item key={item.slug} onClick={item => TagChange(item.key)}>{item.tagname}</Menu.Item>)}
              </StyledMenu>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={[16, 40]}>
            <Col span={24}>
              <Tab_list tabs={tab_select_list} activeKey={tabKey ? tabKey : tab_select_list[0]} defaultActiveKey={tab_select_list[0]} onClick={key => TabView(key)} position={"top"} />
            </Col>
            <Col span={24} style={{ paddingTop: "0" }}>
              {isPosts && articleData ? <ArticleList articles={articleData.articles} /> : null}

              {isFollowers ? <FollowList followings={false} /> : null}
              {isFollowings ? <FollowList followings={true} /> : null}

              {isTag ? tagSettings ?
                <GroupSetting page={"tag"} currentTag={currentTag} /> :
                pubTags ?
                  <ArticleList
                    modReview={true}
                    currentTag={currentTag}
                    articles={publishedTags} /> :
									<ArticleList
                    articles={needsReview}
                    currentTag={currentTag} />
                	: null}

              {isOrg ? orgMembers ? orgArticles ?
								isOrgSettings ? <GroupSetting page={"org"}
								currentOrg={currentOrg} /> :
                isMembers ? <UserList
									currentOrg={currentOrg}
									users={orgMembers.organization.followers.concat(orgMembers.organization.moderators)} /> :
								<ArticleList
									articles={orgArticles.articles}
									currentOrg={currentOrg} /> : null : null : null}

              {isSettings ? <AccountSettings /> : null}

              {isAdmin ? <AdminPanel tags={dropDownTags} /> : null}
            </Col>
          </Row>
        </Col>
        <Col span={3}>
          {isSettings ? <p style={{ opacity: "0.7", marginTop: "16px", fontSize: "18px" }}>Live Website</p> : null}
        </Col>
      </Row>
    );
  }
  else {
    return (<div></div>)
  }
};

Profile.getInitialProps = async ({ query: { pid } }) => {
  const { data: initialProfile } = await UserAPI.get(pid);
  return { initialProfile };
};

export default Profile;
