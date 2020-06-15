import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Row, Col, Menu } from 'antd';
import checkLogin from "../../lib/utils/checkLogin";
import storage from "../../lib/utils/storage";

const Menu_list=(props)=>{
	const { data: currentUser } = useSWR("user", storage);
	  const isLoggedIn = checkLogin(currentUser);
	  const router = useRouter();
	  const {
	    query: { tag },
	  } = router;
	  const handleclick = (e) =>{
	  	props.onClick(e.key)
	  }
	  return(
	  	<>
		<Menu onClick={handleclick} style={{ width: '100%' }} mode="vertical">
			<Menu.Item key={"Posts"}>Posts</Menu.Item>
			<Menu.Item key={"Followers"}>Followers</Menu.Item>
			<Menu.Item key={"Following"}>Followings</Menu.Item>
			<Menu.Item key={"Account Settings"}>Account Settings</Menu.Item>
		</Menu>
		</>
	);
};
export default Menu_list;