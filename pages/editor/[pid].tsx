import axios from "axios";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import Editor from 'rich-markdown-editor';

import ListErrors from "../../components/common/ListErrors";
import TagInput from "../../components/editor/TagInput";
import ArticleAPI from "../../lib/api/article";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import editorReducer from "../../lib/utils/editorReducer";
import storage from "../../lib/utils/storage";

const UpdateArticleEditor = ({ article: initialArticle }) => {
  const initialState = {
    title: initialArticle.title,
    description: initialArticle.description,
    body: initialArticle.body,
    tagList: initialArticle.tagList,
  };

  const [title,setTitle] = useState(initialState.title)
  
  const [description,setDesc] = useState(initialState.description)

  var [values,setValue] = useState(initialState.body)

  var [value_dummy,setDummyValue] = useState(initialState.body)

  const [dark_theme,Change_theme] = useState(false)

  const [isLoading, setLoading] = React.useState(false);
  const { data: currentUser } = useSWR("user", storage);
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const handleTitle = e =>{
    setTitle(e.target.value)
  }
  const handleDesc = e =>{
    setDesc(e.target.value)
  } 

  const ChangeTheme = () => {
    if(dark_theme){
      Change_theme(false)
    }
    else{
      Change_theme(true)
    }
  }

  const Save = () => {
    setValue(value_dummy)
    handleSubmit()
  }

  const handleChange = (value => {
    setDummyValue(value())
  });

  const handleSubmit = async () => {
    initialState.title=title
    if(description!=""){
      initialState.description=description
    }
    else{
      initialState.description="This article has no description"
    }
    initialState.body=value_dummy
    setLoading(true);
    const { data, status } = await axios.put(
      `${SERVER_BASE_URL}/articles/${pid}`,
      JSON.stringify({ article: initialState }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
        },
      }
    );

    setLoading(false);

    if (status !== 200) {
      setErrors(data.errors);
    }

    Router.push("/");
  };

  return (
    <div style={{background:"white",width:'60%',marginLeft:'auto',marginRight:'auto'}}>
        <br />
        <br />
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Set a Title for Your Article"
          value={title}
          onChange={handleTitle}
          style={{marginBottom:"2%",border:"none",padding:"0"}}
        />
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Set a description"
          value={description}
          onChange={handleDesc}
          style={{marginBottom:"2%",border:"none",padding:"0"}}
        />
        <Editor
          id="new_article"
          value={values}
          defaultValue={values}
          onChange={handleChange}
          dark={dark_theme}
          uploadImage={async file=>{
            const data = new FormData();
            data.append("file",file);
            data.append("upload_preset", 'upload')
            const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/upload",{
              method:'POST',
              body: data
            });
            const response = await res.json();
            return response.secure_url;
          }}
          autoFocus
        />
        <button style={{marginTop:"2%"}}
          className="btn btn-lg pull-xs-right btn-primary"
          type="button"
          disabled={isLoading}
          onClick={Save}
        >
          Publish Article
        </button>
    </div>  
  );
};

UpdateArticleEditor.getInitialProps = async ({ query: { pid } }) => {
  const {
    data: { article },
  } = await ArticleAPI.get(pid);
  return { article };
};

export default UpdateArticleEditor;