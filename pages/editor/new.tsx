import Router from "next/router";
import useSWR from "swr";
import React, { useState,createRef } from 'react';
import Editor from 'rich-markdown-editor';
import ListErrors from "../../components/common/ListErrors";
import TagInput from "../../components/editor/TagInput";
import ArticleAPI from "../../lib/api/article";
import storage from "../../lib/utils/storage";
import { Alert } from 'antd';
import axios from "axios";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

const PublishArticleEditor = () => {
  var initialState = {
    title: "",
    description: "",
    body: "",
    tagList: [],
  };
  const Title = createRef<HTMLInputElement>()

  const [title,setTitle] = useState("")
  
  const [description,setDesc] = useState("")

  var [values,setValue] = useState("")

  var [value_dummy,setDummyValue] = useState("")

  const [dark_theme,Change_theme] = useState(false)

  const [isLoading, setLoading] = React.useState(false);

  const [Title_required,setTitle_required] = useState(false)

  const [Save_Alert, setSaveAlert] = useState(false)

  const [tags,setTags] = useState([])

  const [id,setId]=useState(null)

  const { data: currentUser } = useSWR("user", storage);

  const addTag = (tag) => {
    setTags([...tags,tag])
  }

  const removeTag = (tag) => {
    setTags(tags.filter(item=>item!=tag))
  }

  const handleTitle = e =>{
    setTitle(e.target.value)
    setTitle_required(false)
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
    if(id!=null){
      AutoSave()
    }
  });

  const AutoSave = async ()=>{
    if(title!=""){
    initialState.title=title
    if(description!=""){
      initialState.description=description
    }
    else{
      initialState.description="This article has no description"
    }
    initialState.body=value_dummy
    initialState.tagList = tags
    const { data, status } = await axios.put(
        `${SERVER_BASE_URL}/articles/${id}/draft`,
        JSON.stringify({ article: initialState }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
          },
        }
      );
    }
  }

  const Save_Draft = async ()=>{
    if(id==null){
      if(title!=""){
        setSaveAlert(true)
        initialState.title=title
        if(description!=""){
          initialState.description=description
        }
        else{
          initialState.description="This article has no description"
        }
        initialState.body=value_dummy
        initialState.tagList = tags
          const { data, status } = await ArticleAPI.create(
            initialState,
            currentUser?.token
          );
          setId(data.article.slug)
        setTimeout(()=>{
          setSaveAlert(false)
        },1000);
      }
      else{
       if(Title.current){
          Title.current.focus();
        }
        setTitle_required(true);
      }
    }
    else{
      if(title!=""){
        AutoSave()
      }
      else{
        if(Title.current){
          Title.current.focus();
        }
        setTitle_required(true);
      }
    }
  }

  const handleSubmit = async () => {
    initialState.title=title
    if(description!=""){
      initialState.description=description
    }
    else{
      initialState.description="This article has no description"
    }
    initialState.body=value_dummy
    initialState.tagList = tags
    if(title!=""){
    setLoading(true);
    if(id==null){
      const { data, status } = await ArticleAPI.create(
        initialState,
        currentUser?.token
      );
    }
    else{
      const { data, status } = await axios.put(
        `${SERVER_BASE_URL}/articles/${id}`,
        JSON.stringify({ article: initialState }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${encodeURIComponent(currentUser?.token)}`,
          },
        }
      );
    }
      setLoading(false);
      Router.push("/");
    }
    else{
      if(Title.current){
        Title.current.focus();
      }
      setTitle_required(true);
    }
  };

  return (
      <div style={{background:"white",width:'60%',marginLeft:'auto',marginRight:'auto'}}>
        <br />
        {Title_required?<Alert message="Title required" type="warning"/>:null}
        {Save_Alert?<Alert message="Your Article is Saved" type="success"/>:null}
        <br />
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Set a Title for Your Article"
          value={title}
          onChange={handleTitle}
          style={{marginBottom:"2%",border:"none",padding:"0"}}
          ref={Title}
        />
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Set a description"
          value={description}
          onChange={handleDesc}
          style={{marginBottom:"2%",border:"none",padding:"0"}}
        />
        <TagInput
            tagList={tags}
            addTag={addTag}
            removeTag={removeTag}
        />
        <Editor
          id="new_article"
          value={values}
          onChange={handleChange}
          readOnly={false}
          onKeyDown={null}
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
        <button style={{marginTop:"2%",marginRight:"2%"}}
          className="btn btn-lg pull-xs-right btn-primary"
          type="button"
          disabled={isLoading}
          onClick={Save_Draft}
        >
          Save Draft
        </button>
    </div>  
  )
};

export default PublishArticleEditor;