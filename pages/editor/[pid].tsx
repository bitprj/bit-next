import axios from "axios";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import Editor from 'rich-markdown-editor';
import TagInput from "../../components/editor/TagInput";
import ArticleAPI from "../../lib/api/article";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import storage from "../../lib/utils/storage";
import { Alert, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const UpdateArticleEditor = ({ article: initialArticle }) => {
  const initialState = {
    title: initialArticle.title,
    description: initialArticle.description,
    body: initialArticle.body,
    tagList: initialArticle.tagList,
    coverImage: initialArticle.coverImage,
    isPublished: false
  };
  const Title = React.createRef<HTMLInputElement>();

  const [title, setTitle] = useState(initialState.title)

  const [description, setDesc] = useState(initialState.description)

  var [values, setValue] = useState(initialState.body)

  var [value_dummy, setDummyValue] = useState(initialState.body)

  const [dark_theme, Change_theme] = useState(false)

  const [Title_required, setTitle_required] = useState(false)

  const [tags, setTags] = useState(initialState.tagList)

  const [coverImg,setCoverImg] = useState(initialState.coverImage)

  const [coverImgList,setCoverImgList] = useState([])

  const { Dragger } = Upload;

  const [isLoading, setLoading] = React.useState(false);
  const { data: currentUser } = useSWR("user", storage);
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const addTag = (tag) => {
    setTags([...tags, tag])
  }

  const removeTag = (tag) => {
    setTags(tags.filter(item => item != tag))
  }

  const handleTitle = e => {
    setTitle(e.target.value)
    setTitle_required(false)
  }
  const handleDesc = e => {
    setDesc(e.target.value)
  }

  const ChangeTheme = () => {
    if (dark_theme) {
      Change_theme(false)
    }
    else {
      Change_theme(true)
    }
  }

  const uploadCover = async (file) =>{
    const cover = new FormData();
    cover.append("file", file);
    cover.append("upload_preset", 'upload')
    const res = await fetch("https://api.cloudinary.com/v1_1/rajshah/upload", {
      method: 'POST',
      body: cover
     });
    const response = await res.json();
    setCoverImg(response.secure_url);
  }

  const uploadCoverChange = (info) =>{
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    if(fileList.length==0){
      setCoverImg(null)
    }
    setCoverImgList(fileList)
  }

  const Save = () => {
    setValue(value_dummy)
    handleSubmit()
  }

  const handleChange = (value => {
    setDummyValue(value())
    if (title != "") {
      saveDraft()
    }
  });

  const saveDraft = async () => {
    initialState.title = title
    initialState.description = description ? description : "This article has no description"
    initialState.body = value_dummy
    initialState.tagList = tags
    initialState.coverImage = coverImg
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
  }

  const handleSubmit = async () => {
    initialState.title = title
    initialState.description = description ? description : "This article has no description"
    initialState.body = value_dummy
    initialState.tagList = tags
    initialState.coverImage = coverImg
    initialState.isPublished = true
    if (title != "") {
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
      Router.push("/");
    }
    else {
      if (Title.current) {
        Title.current.focus();
      }
      setTitle_required(true);
    }
  };

  return (
    <div style={{ background: "white", width: '60%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5em' }}>
      <br />
      {Title_required ? <Alert message="Title required" type="warning" /> : null}
      <br />
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Set a Title for Your Article"
        value={title}
        onChange={handleTitle}
        style={{ marginBottom: "2%", border: "none", padding: "0" }}
        ref={Title}
      />
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Set a description"
        value={description}
        onChange={handleDesc}
        style={{ marginBottom: "2%", border: "none", padding: "0" }}
      />
      <TagInput
        tagList={tags}
        addTag={addTag}
        removeTag={removeTag}
      />
      <Dragger
        beforeUpload={uploadCover}
        onChange={uploadCoverChange}
        fileList={coverImgList}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload Cover Image</p>
      </Dragger>
      <br/>
      <Editor
        id="new_article"
        value={values}
        readOnly={false}
        defaultValue={values}
        onKeyDown={null}
        onChange={handleChange}
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
        autoFocus
      />
      <button style={{ marginTop: "2%" }}
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