import React from "react";
import { Input, Form } from 'antd';

const Form_Items = (props) => {
	return (
		<div>
			{props.Item.map(item => <Form.Item label={item[0]} name={item[1]} rules={item[2]}><Input placeholder={item[3]} onChange={props.onChange(item[4])} /></Form.Item>)}
		</div>
	);
};

export default Form_Items;