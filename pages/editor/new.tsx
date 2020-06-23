import Router from "next/router";
import useSWR from "swr";
import axios from "axios";
import styled from 'styled-components';
import React, { useState, createRef } from 'react';
import Editor from 'rich-markdown-editor';
import TagInput from "../../components/editor/TagInput";
import ArticleAPI from "../../lib/api/article";
import storage from "../../lib/utils/storage";
import { Upload, message, Button, Col, Row, Divider, Spin } from 'antd';
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import Tab_list from "../../components/profile/Tab_list";
import { UploadOutlined  } from '@ant-design/icons';
import Twemoji from 'react-twemoji';

var timeout = null
const PublishArticleEditor = () => {
  var initialState = {
    title: "",
    description: "",
    body: "",
    tagList: [],
    coverImage: "",
    isPublished: true
  };
  const Title = createRef<HTMLInputElement>()

  const [title, setTitle] = useState("")

  const [description, setDesc] = useState("")

  var [values, setValue] = useState("")

  var [value_dummy, setDummyValue] = useState("")

  const [dark_theme, Change_theme] = useState(false)

  const [isLoading, setLoading] = React.useState(false);

  const [tags, setTags] = useState([])

  const [tags_display, setTagsDisplay] = useState([])

  const [id, setId] = useState(null)

  const [coverImg, setCoverImg] = useState("")

  const [coverImgList, setCoverImgList] = useState([])

  const [read,SetReadOnly] = useState(false)

  const { Dragger } = Upload;

  const { data: currentUser } = useSWR("user", storage);

  const StyledEmoji = styled(Twemoji)`
  .emoji {
    width: 20px;
    height: 20px;
  }
  `;
  const StyledSpan = styled.span`
    font-size: 15px;
    font-weight: bold;
    line-height: 20px;
    color: #000000;
  `;

  const addTag = (tag) => {
    if(!tags.includes(tag) && tags.length<=4){
      setTags([...tags, tag])
      setTagsDisplay([...tags_display,{slug:tag,tagname:tag}])
    }
  }

  const removeTag = (tag) => {
    setTags(tags.filter(item => item != tag.slug))
    setTagsDisplay(tags_display.filter(item => item != tag))
  }

  const handleTitle = e => {
    setTitle(e.target.value)
    AutoSave_Call()
  }
  const handleDesc = e => {
    setDesc(e.target.value)
    AutoSave_Call()
  }

  const ChangeTheme = () => {
    if (dark_theme) {
      Change_theme(false)
    }
    else {
      Change_theme(true)
    }
  }

  const Save = () => {
    setValue(value_dummy)
    handleSubmit()
  }

  const handleChange = (value => {
    setDummyValue(value())
    AutoSave_Call()
  });

  const AutoSave_Call = () =>{
    if (id != null && title!="") {
      if(timeout){
        clearTimeout(timeout)
      }
      timeout = setTimeout(()=>{
        setLoading(true)
        AutoSave()
      },3000);
    }
  }

  const uploadCover = async (file) => {
    if(file){ 
      if(file.type.split("/")[0]=="image"){  
        const cover = new FormData();
        cover.append("file", file);
        cover.append("upload_preset", 'upload')
        const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/image/upload", {
          method: 'POST',
          body: cover
        });
        const response = await res.json();
        setCoverImg(response.secure_url);
      }
      else{
        message.warning("File Type Error: Please Upload an Image File")
      } 
    }
  }

  const uploadCoverChange = (info) => {
    if(info.file){
      if(info.file.type.split("/")[0]=="image"){
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        if (fileList.length == 0) {
          setCoverImg("")
        }
        setCoverImgList(fileList)
      }
    }
  }

  const RemoveCoverImage = () => {
    console.log("Cover Image removed")
  }

  const AutoSave = async () => {
    if (title != "") {
      initialState.title = title
      initialState.description = description ? description : "This article has no description"
      initialState.body = value_dummy
      initialState.tagList = tags
      initialState.coverImage = coverImg
      initialState.isPublished = false
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
      setLoading(false)
    }
  }

  const Save_Draft = async () => {
    if (id == null) {
      if (title != "") {
        initialState.title = title
        initialState.description = description ? description : "This article has no description"
        initialState.body = value_dummy
        initialState.tagList = tags
        initialState.coverImage = coverImg
        initialState.isPublished = false
        const { data, status } = await ArticleAPI.create(
          initialState,
          currentUser?.token
        );
        setId(data.article.slug)
        message.success("Your Article Draft is Saved")
      }
      else {
        if (Title.current) {
          Title.current.focus();
        }
        message.warning("Title Required for this Article")
      }
    }
    else {
      if (title != "") {
        AutoSave()
        message.success("Your Article Draft is Saved")
      }
      else {
        if (Title.current) {
          Title.current.focus();
        }
        message.warning("Title Required for this Article")
      }
    }
  }

  const handleSubmit = async () => {
    initialState.title = title
    initialState.description = description ? description : "This article has no description"
    initialState.body = value_dummy
    initialState.tagList = tags
    initialState.coverImage = coverImg
    if (title != "") {
      setLoading(true);
      if (id == null) {
        const { data, status } = await ArticleAPI.create(
          initialState,
          currentUser?.token
        );
      }
      else {
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
      message.success("Your Article is Published")
      Router.push("/");
    }
    else {
      if (Title.current) {
        Title.current.focus();
      }
      message.warning("Title Required for this Article")
    }
  };

  const TabView = (key) =>{
    if(key=="Write"){
      SetReadOnly(false)
    }
    else{
      SetReadOnly(true)
    }
  }

  return (
    <div style={{ background: "white", width: '75%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5em' }}>
    <Row>
    <Col span={18} style={{paddingRight:"2em"}}>
      <input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={handleTitle}
        style={{ marginBottom: "2%", border: "none", padding: "0",fontSize:"4em",width:"100%",color:"black",fontWeight:"lighter"}}
        ref={Title}
      />
      <input
        type="text"
        placeholder="Set a description"
        value={description}
        onChange={handleDesc}
        style={{ border: "none", padding: "0",width:"100%",color:"black",fontWeight:"lighter",fontSize:"1.5em"}}
      />
      <Divider style={{marginBottom:"0"}}></Divider>
      <Tab_list tabs={["Write","Preview"]} onClick={key => TabView(key)} position={"top"} />
      <Editor
        id="new_article"
        value={values}
        onChange={handleChange}
        readOnly={read}
        onKeyDown={null}
        dark={dark_theme}
        uploadImage={async file => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", 'upload')
          const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/upload", {
            method: 'POST',
            body: data
          });
          const response = await res.json();
          return response.secure_url;
        }}
      />
    </Col>
    <Row>
    <Divider type="vertical" style={{height:"100%",marginRight:"0"}}></Divider>
    </Row>
    <Col span={5}>
      <Row style={{marginLeft:"1em"}}>
        {id? <div>{!isLoading?<p>✓ Draft Saved</p>:<p><Spin/> AutoSaving Draft</p>}</div> :<Button style={{ marginTop: "2%"}}
        type="primary"
        disabled={isLoading}
        onClick={Save_Draft}
        >
        Save Draft
        </Button>}
      </Row>
      <Row style={{marginLeft:"1em"}}>
        <Button style={{ marginTop: "2%" }}
        type="primary"
        disabled={isLoading}
        onClick={Save}
        >
        Publish Article
        </Button>
      </Row>
      <Divider></Divider>
      <Row style={{marginLeft:"1em"}}>
        <Twemoji options={{ className: 'twemoji' }}>
            <StyledEmoji>🏷️<StyledSpan> Tags</StyledSpan></StyledEmoji>
        </Twemoji>
        <p>Enter upto 5 Tags. Enter tag names below.</p>
        <TagInput
        tagList={tags_display}
        addTag={addTag}
        removeTag={removeTag}
        />
      </Row>
      <Divider style={{marginTop:"0"}}></Divider>
      <Row style={{marginLeft:"1em",width:"100%"}}>
         <Twemoji options={{ className: 'twemoji' }}>
            <StyledEmoji>📷<StyledSpan> Select a cover for this story</StyledSpan></StyledEmoji>
        </Twemoji>
        <Upload
            beforeUpload={uploadCover}
            onChange={uploadCoverChange}
            onRemove={RemoveCoverImage}
            fileList={coverImgList}>
            <Button style={{marginTop:"1em"}}>
              <UploadOutlined/>Add Cover
            </Button>
        </Upload>
        {coverImg?<img src={coverImg} style={{width:"-webkit-fill-available"}}/>:null}
      </Row>
      <Divider></Divider>
    </Col>
    </Row>
    </div>
  )
};

export default PublishArticleEditor;