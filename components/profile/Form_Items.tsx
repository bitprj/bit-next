import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import storage from "../../lib/utils/storage";
import checkLogin from "../../lib/utils/checkLogin";
import styled from "styled-components";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import { Avatar, Row, Col, Input, Form, Button, message } from 'antd';

const FormItem = (props) => {
	return(
		<div>
		<Form.Item label={props.label} name={props.name} rules={props.rules}><Input placeholder={props.placeholder} onChange={props.onChange}/></Form.Item>
		</div>
	);
};

export default FormItem;