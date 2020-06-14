import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";

import CommentInput from "./CommentInput";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

import { CommentType } from "../../lib/types/commentType";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Avatar, Button, Comment, Form, Input, List } from 'antd';

const ReplyBox = () => {
    const Editor = ({ onChange, onSubmit, submitting, value }) => (
        <>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Add Comment
            </Button>
            </Form.Item>
        </>
    );

    const { TextArea } = Input;

    var initialState = {
        value: ""
    };

    const [value, setValue] = useState("");
    const [showMe, setShowMe] = useState(false);
    const toggle = () => { setShowMe(!showMe) };

    const handleChange = async () => {
        initialState.value = value;
    };

    const handleTitle = e => {
        setValue(e.target.value)
    }

    return (
        <span key="comment-nested-reply-to" onClick={toggle}>
            <Comment
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                }
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        value={value}
                    />
                }
            />
        </span>
    );
};

export default ReplyBox;
