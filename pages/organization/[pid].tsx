import React from "react";
import useSWR, { mutate, trigger } from "swr";
import axios from "axios";
import styled from 'styled-components';
import storage from "../../lib/utils/storage";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import OrganizationsAPI from "../../lib/api/organizations";
import { Col, Row } from 'antd';
import Header from "../../components/global/Header";
import ArticleList from "../../components/global/ArticleList";
import UserList from "../../components/global/UserList";
import fetcher from "../../lib/utils/fetcher";
import Tab_list from "../../components/profile/Tab_list";

const Organization = ({organization: InitialOrganization}) => {
	const InitialOrganizationData = {
		username: InitialOrganization.name,
		image: InitialOrganization.image,
		following: InitialOrganization.is_following,
		is_moderator: InitialOrganization.is_moderator,
		followers: InitialOrganization.followers,
		moderators: InitialOrganization.moderators,
		joined: InitialOrganization.createdAt,
		bio: InitialOrganization.description
	}

	const { 
		data: OrganizationArticles, 
		error: ArticleError,
	} = useSWR(
		`${SERVER_BASE_URL}/organizations/${InitialOrganization.slug}/articles`,
    	fetcher,
    );

    const {
    	data: OrganizationData,
    	error: OrganizationError,
    } = useSWR(
    	`${SERVER_BASE_URL}/organizations/${InitialOrganization.slug}`,
    	fetcher, {refreshInterval:500},
    );

    if(OrganizationData!=undefined && OrganizationData.organization!=InitialOrganization){
    	InitialOrganization = OrganizationData.organization;
    	InitialOrganizationData.following = InitialOrganization.is_following;
	}

	const Articles = OrganizationArticles || {
		articles: [],
	};

	const [PostTab,setPostTab] = React.useState(true)

	const [FollowerTab,setFollowerTab] = React.useState(false)

	const handleFollow = async () => {
	    OrganizationsAPI.follow(InitialOrganization.slug);
  	};

	const handleUnfollow = async () => {
		OrganizationsAPI.unfollow(InitialOrganization.slug);
	};

	const TabClick = (key) => {
		if(key=='Posts'){
			setPostTab(true)
			setFollowerTab(false)
		}
		else if(key=='Followers'){
			setPostTab(false)
			setFollowerTab(true)
		}
	}

    return(
    	<div style={{width: "75%", margin: "6em auto"}}>
    		<Col span={20}>
    			<Header user={InitialOrganizationData} follow={handleFollow} unfollow={handleUnfollow}/>
    		</Col>
    		<Col span={4}/>
	    	<Row>
	    		<Col span={14}>
		    		<Row>
		    			<Col span={24}>
		    				<Tab_list tabs={['Posts','Followers']} position={'top'} onClick={TabClick}/>
		    			</Col>
		    		</Row>
		    		<Row>
			    		<Col span={24}>
			    			{PostTab?<ArticleList articles={Articles.articles}/>:null}
			    			{FollowerTab?<UserList users={InitialOrganization.followers}/>:null}
			    		</Col>
		    		</Row>
	    		</Col>
	    		<Col span={2}/>
	    		<Col span={4}>
	    			<Col span={24}>
	    				<h5>Moderators</h5>
	    				<UserList users={InitialOrganization.moderators}/>
	    				<br/>
	    				<h5>Members</h5>
	    				<UserList users={InitialOrganization.followers}/>
	    			</Col>
	    		</Col>
	    	</Row>
    	</div>
    ); 
}

Organization.getInitialProps = async ({ query: { pid } }) => {
  const {
    data: { organization },
  } = await OrganizationsAPI.get(pid);
  return { organization };
};

export default Organization;