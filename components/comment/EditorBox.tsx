import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { trigger } from "swr";

import CustomImage from "../common/CustomImage";
import CustomLink from "../common/CustomLink";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import storage from "../../lib/utils/storage";


import {message, Form, Button, List, Input} from 'antd';
const { TextArea } = Input;


const Editor = ({onChange, onSubmit, submitting, value, id }) => (
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
)

const EditorBox = ( {commentId} ) => {
    const { data: currentUser } = useSWR("user", storage);
    const isLoggedIn = checkLogin(currentUser);
    const router = useRouter();
    const {
      query: { pid },
    } = router;
  
    const [content, setContent] = React.useState("");
    const [theId, setId] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
  
    const handleChange = React.useCallback((e) => {
      setContent(e.target.value);
      setId(e.target.id);
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      await axios.post(
        `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}/comments`,
        JSON.stringify({
          comment: {
            body: content,
            comment_id: commentId,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
          },
        }
      );
      setLoading(false);
      setContent("");
      trigger(`${SERVER_BASE_URL}/articles/${pid}/comments`);
    };

    if (!isLoggedIn) {//} && !clickedReplyTo) {
        return (
            <p>
                Not Logged In RN
            </p>
        );

    } else if (isLoggedIn) {
      return (
        <Editor 
              onChange={handleChange}
              onSubmit={ handleSubmit }
              submitting = { isLoading }
              value={ content }
              id = { theId }
            />
      );
    }
    return (
        <p>
            Logged In RN

        </p>
           
    );

};

export default EditorBox;