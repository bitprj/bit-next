import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";

import ArticleList from "../../components/article/ArticleList";
import ErrorMessage from "../../components/common/ErrorMessage";
import User from "../../components/global/User";
import FollowList from "../../components/global/FollowList";
import Tab_list from "../../components/profile/Tab_list";
import AccountSettings from "../../components/profile/AccountSettings";
import { Row, Col, Tabs, Menu } from 'antd';

import styled from "styled-components";

import { useSession, getSession } from 'next-auth/client';

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

	//we're getting something from the api, but it doesn't seem like it's returning
	//everything it should return
	const { profile } = fetchedProfile || initialProfile;
	const { username, bio, image, following } = profile;
	//this is usestate, so it stores the state in the first variable (state as given)
	//and then the second variable is what you're gonna call when you want to change
	//the state
	const [list, setList] = React.useState(["Posts", "Followers", "Following", "Account Settings"])
	const [tab_select_list, setTabList] = React.useState(["All Posts", "Published", "Drafts"])
	//this is being set to true because it's the first thing to show
	const [isPosts, setPostsPage] = React.useState(true)
	//the rest don't show immediately so they're set to false
	const [isFollowers, setFollowersPage] = React.useState(false)
	const [isFollowings, setFollowingsPage] = React.useState(false)
	const [isTag, setTagPage] = React.useState(false)
	const [isSettings, setSettingsPage] = React.useState(false)

	//k, this is that one that stays in lokalstorage
	const { data: currentUser } = useSWR("user", storage);
	const isLoggedIn = checkLogin(currentUser);
	const isUser = currentUser && username === currentUser?.username;
	const { TabPane } = Tabs;

	//this tells it which list its gonna show
	const TabChange = (key) => {
		if (key == "Posts") {
			setTabList(["All Posts", "Published", "Drafts"])
			setPostsPage(true)
			setFollowersPage(false)
			setFollowingsPage(false)
			setTagPage(false)
			setSettingsPage(false)
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
	const TabView = (key) => { }

	if (true) {
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
						{/*can either modify all the lists here by passing in the tab parameter
							as props. cause the end goal is to sort the articles, but right
							now it just imports the entire article list. actually, what props get passed
							to article list?
							article card is the one that has all the props*/}
							{isPosts ? <ArticleList /> : null}
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

Profile.getInitialProps = async ({ query: { pid } }) => {
	const { data: initialProfile } = await UserAPI.get(pid);
	return { initialProfile };
};

export default Profile;
