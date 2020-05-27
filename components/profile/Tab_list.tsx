import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Row, Col, Tabs } from 'antd';
import checkLogin from "../../lib/utils/checkLogin";
import storage from "../../lib/utils/storage";

const Tab_list=(props)=>{
	const { TabPane } = Tabs;
	const { data: currentUser } = useSWR("user", storage);
	  const isLoggedIn = checkLogin(currentUser);
	  const router = useRouter();
	  const {
	    query: { tag },
	  } = router;
	  return(
	  	<>
		<Tabs tabPosition={props.position} size={'large'} animated={false} onTabClick={key=>props.onClick(key)}>
			{[...props.tabs].map(i=>(
				<TabPane tab={i} key={i}>
            	</TabPane>
			))}
		</Tabs>
		</>
	);
};
export default Tab_list;