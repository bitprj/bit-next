import React from "react";
import { Input, Form } from 'antd';

const FormItem = (props) => {
	return (
		<div>
			<Form.Item label={props.label} name={props.name} rules={props.rules}><Input placeholder={props.placeholder} onChange={props.onChange} /></Form.Item>
		</div>
	);
};

export default FormItem;