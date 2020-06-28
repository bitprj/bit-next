import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import { Avatar, Row, Col, Input, Form, Button, message } from 'antd';

const Form_Items = (props) => {
	return(
		<div>
		{props.Item.map(item => <Form.Item label={item[0]} name={item[1]} rules={item[2]}><Input placeholder={item[3]} onChange={props.onChange(item[4])}/></Form.Item>)}
		</div>
	);
};

export default Form_Items;