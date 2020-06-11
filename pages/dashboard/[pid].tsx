import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import UserAPI from "../../lib/api/user";
import ArticleAPI from "../../lib/api/article";
import checkLogin from "../../lib/utils/checkLogin";

import ArticleList from "../../components/article/ArticleList";
import ErrorMessage from "../../components/common/ErrorMessage";
import User from "../../components/global/User";
import FollowList from "../../components/global/FollowList";
import Tab_list from "../../components/profile/Tab_list";
import AccountSettings from "../../components/profile/AccountSettings";
import { Row, Col, Tabs, Menu } from 'antd';

import styled from "styled-components";

const StyledMenu = styled(Menu)`
	font-size: 15px;
	font-weight: bold;
`

const Profile = ({ initialProfile }) => {
	{/*so this is setting the router up and then calling query: pid from the router,
		which is just the pid which is just the username
		query is the data type because, you know, typescript*/}
	const router = useRouter();
	const {
		query: { pid },
	} = router;

	{/*right, and now the fetched and initial profile are matching (or not
	if you're not the user)*/}
	{/*the imported fetcher function checks to see if there's a user in localstorage,
	and if there is whether there's an authentification token. if there is it sends a
	get request with the authorization tokens*/}
	const {
		data: fetchedProfile,
		error: profileError,
	} = useSWR(
		`${SERVER_BASE_URL}/profiles/${encodeURIComponent(String(pid))}`,
		fetcher,
		{ initialData: initialProfile }
	);

	if (profileError) return <ErrorMessage message="Can't load profile" />;

	{/*"if you couldnt fetch anything, use the initial one you got"*/}
	const { profile } = fetchedProfile || initialProfile;
	{/*grabbing the data from the profile*/}
	const { username, bio, image, following } = profile;
	{/*this is usestate, so it stores the state in the first variable (state as given)
	and then the second variable is what you're gonna call when you want to change
	the state*/}
	const [list, setList] = React.useState(["Posts", "Followers", "Following", "Account Settings"])
	const [tab_select_list, setTabList] = React.useState(["All Posts", "Published", "Drafts"])
	{/*this is being set to true because it's the first thing to show*/}
	const [isPosts, setPostsPage] = React.useState(true)
	{/*the rest don't show immediately so they're set to false*/}
	const [isFollowers, setFollowersPage] = React.useState(false)
	const [isFollowings, setFollowingsPage] = React.useState(false)
	const [isTag, setTagPage] = React.useState(false)
	const [isSettings, setSettingsPage] = React.useState(false)

	{/*these were mine but don't seem necessary anymore*/}
	const [isAllArticles, setAllArticles] = React.useState(true);
	const [isPublished, setPublished] = React.useState(false);
	const [isDrafts, setDrafts] = React.useState(false);

	{/*this just uses getItem by key from localstorage and sets currentUser to that*/}
	const { data: currentUser } = useSWR("user", storage);
	{/*checklogin checks to see if the useSWR call above actually returned a user
		since obviously if it didnt it'd mean nobody's home*/}
	const isLoggedIn = checkLogin(currentUser);
	{/*this is just checking that... the currentuser as defined above matches
		the user fetched from getInitialProps*/}
	const isUser = currentUser && username === currentUser?.username;

	{/*tab thing from ant design*/}
	const { TabPane } = Tabs;

	{/*this is the function to change which list it's gonna show*/}
	const TabChange = (key) => {
		if (key == "Posts") {
			setTabList(["All Posts", "Published", "Drafts"])
			setPostsPage(true)
			setFollowersPage(false)
			setFollowingsPage(false)
			setTagPage(false)
			setSettingsPage(false)

			setAllArticles(true);
			setDrafts(false);
			setPublished(false);
		}
		else if (key == "Followers") {
			setTabList(["Old -> New", "New -> Old"])
			setPostsPage(false)
			setFollowersPage(true)
			setFollowingsPage(false)
			setTagPage(false)
			setSettingsPage(false)
		}
		else if (key == "Following") {
			setTabList(["Old -> New", "New -> Old"])
			setPostsPage(false)
			setFollowersPage(false)
			setFollowingsPage(true)
			setTagPage(false)
			setSettingsPage(false)
		}
		else if (key == "Account Settings") {
			setTabList(["Settings", "Organization", "API Keys"])
			setPostsPage(false)
			setFollowersPage(false)
			setFollowingsPage(false)
			setTagPage(false)
			setSettingsPage(true)
		}
		//seems like this will never call tags
		else {
			setTabList(["Most Viewed", "Most Liked", "Most Recent"])
			setPostsPage(false)
			setFollowersPage(false)
			setFollowingsPage(false)
			setTagPage(true)
			setSettingsPage(false)
		}
	}

	{/*this was for drafts and published, but it seems like it's not needed now*/}
	const TabView = (key) => {
	 	if (key == "All Posts") {
			setAllArticles(true);
			setDrafts(false);
			setPublished(false);
		}
		else if (key == "Published") {
			setAllArticles(false);
			setDrafts(false);
			setPublished(true);
		}
		else if (key == "Drafts") {
			setAllArticles(false);
			setDrafts(true);
			setPublished(false);
		}
		else {
			setAllArticles(false);
			setDrafts(false);
			setPublished(false);
		}
	}

	if (isUser) {
		//and here are the goods
		return (
			<Row gutter={16} style={{ marginTop: "10%", marginLeft: "0", marginRight: "0" }}>
				<Col span={2}></Col>
				<Col className="gutter-row" span={4}>
					<Row gutter={[16, 40]}>
						<Col span={24}>
							<User name={username} image={image} username={username} />
						</Col>
						<Col span={24}>
							<StyledMenu>
								{list.map(item => <Menu.Item key={item} onClick={item => TabChange(item.key)}>{item}</Menu.Item>)}
							</StyledMenu>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Row gutter={[16, 40]}>
						<Col span={24}>
							<Tab_list tabs={tab_select_list} onClick={key => TabView(key)} position={"top"} />
						</Col>
						<Col span={24} style={{ paddingTop: "0" }}>
							{isPosts && isAllArticles ? <ArticleList /> : null}
							{isPosts && isPublished ? <div>published stuff</div> : null}
							{isPosts && isDrafts ? <div>Drafts here</div> : null}
							{isFollowers ? <FollowList followings={false} /> : null}
							{isFollowings ? <FollowList followings={true} /> : null}
							{isTag ? <ArticleList /> : null}
							{isSettings ? <AccountSettings /> : null}
						</Col>
					</Row>
				</Col>¬
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

{/*this is the, uh, the info of the logged in user*/}
Profile.getInitialProps = async ({ query: { pid } }) => {
	const { data: initialProfile } = await UserAPI.get(pid);
	return { initialProfile };
};

export default Profile;
