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

/*<Editor onChange={console.log("onchange")}//this.handleChange}
              onSubmit={console.log("onsubmit")}//this.handleSubmit}
              submitting={false}//submitting}
              value={'HEYWORLD'}//value}
            />
*/

// ADDED
const Editor = ({onChange, onSubmit, submitting, value }) => (
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
// END ADDED

const EditorBox = ( {commentId} ) => {
    console.log("EditorBox: entered here");
    const { data: currentUser } = useSWR("user", storage);
    const isLoggedIn = checkLogin(currentUser);
    const router = useRouter();
    const {
      query: { pid },
    } = router;
  
    const [content, setContent] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
  
    const handleChange = React.useCallback((e) => {
      console.log("EditorBox: called handleChange");
      setContent(e.target.value);
    }, []);
  
    const handleSubmit = async (e) => {
      console.log("EditorBox: Called handleSubmit");
      e.preventDefault();
      setLoading(true);
      await axios.post(
        `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}/comments/${commentId}`,
        JSON.stringify({
          comment: {
            body: content,
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
    var clickedReplyTo;// = thisValue.thisValue;
    clickedReplyTo = true;
    console.log("clicekdReplyTo is ", clickedReplyTo, '*');

    console.log("IN EDITORBOX");
    if (!isLoggedIn) {//} && !clickedReplyTo) {
        return (
            <p>
                Not Logged In RN
            </p>
        );

    } else if (isLoggedIn && clickedReplyTo) {
      return (
        <Editor 
              onChange={handleChange}
              onSubmit={ handleSubmit }
              submitting = { isLoading }
              value={ content }
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