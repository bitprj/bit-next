import Router from "next/router";
import useSWR from "swr";
import React, { useState } from 'react';
import { debounce } from "lodash";
import Editor from 'rich-markdown-editor';
import ListErrors from "../../components/common/ListErrors";
import TagInput from "../../components/editor/TagInput";
import ArticleAPI from "../../lib/api/article";
import storage from "../../lib/utils/storage";
import editorReducer from "../../lib/utils/editorReducer";

const PublishArticleEditor = () => {
  var initialState = {
    title: "",
    description: "",
    body: "",
    tagList: [],
  };
  const [title,setTitle] = useState("")
  
  const [description,setDesc] = useState("")

  var [values,setValue] = useState("")

  var [value_dummy,setDummyValue] = useState("")

  const [dark_theme,Change_theme] = useState(false)

  const [isLoading, setLoading] = React.useState(false);
  const { data: currentUser } = useSWR("user", storage);

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
    const { data, status } = await ArticleAPI.create(
      initialState,
      currentUser?.token
    );

    setLoading(false);

    if (status !== 200) {
      setErrors(data.errors);
    }

    Router.push("/");
  };

  return (
      <div style={{background:"white",width:'60%',marginLeft:'auto',marginRight:'auto'}}>
          {/*<div style={{display:"flex"}}>
            <br />
            <button type="button" onClick={ChangeTheme}>
              Change Theme
            </button>
          </div>*/}
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
  )
};

export default PublishArticleEditor;