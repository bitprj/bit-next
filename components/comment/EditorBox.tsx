// Based on CommentInput.tsx

import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { trigger } from "swr";

import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import storage from "../../lib/utils/storage";


import { Form, Button, Input} from 'antd';
const { TextArea } = Input;


const Editor = ( { onChange, onSubmit, submitting, value } ) => (
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
    const [isLoading, setLoading] = React.useState(false);
  
    const handleChange = React.useCallback((e) => {
      setContent(e.target.value);
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

    if (!isLoggedIn) {
        return (
            null
        );

    } else { // is Logged In
      return (
        <Editor 
              onChange={handleChange}
              onSubmit={ handleSubmit }
              submitting = { isLoading }
              value={ content }
            />
      );
    }

};

export default EditorBox;