import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React from "react";
import { Mentions } from 'antd';
import 'antd/dist/antd.css';
import useSWR,{mutate,trigger} from "swr";
import fetcher from "../../lib/utils/fetcher";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import { Button } from 'antd';
import TagAPI from "../../lib/api/tag";
import { Alert } from 'antd';
import styled from 'styled-components';



type AlertError = 'info' | 'warning' | 'success' | 'error'
let alertType : AlertError ;
const SearchDiv = styled.div`
width: 100%;
 margin-top: 2em;
 font-weight:bold;
 margin-bottom : 2em
`
const Link = styled.a`
    border: 1px solid black;
    padding: 0.5em
`

const AlertStyle = styled(Alert)`
    margin-top: 1em
`
const ButtonStyle = styled(Button)`
    margin-top: 1em;
    background: black;
    &:hover {
        background: black
      }
      &:focus {
        background: black
      }
`

const { Option } = Mentions;


const Admin = (props) => {
   

    const [value, setValue] = React.useState("Select tag")
    const [key, setKey] = React.useState("")

    const [selectedOption, setSelectedOption] = React.useState()
    const [alert, setAlert] = React.useState(false)
    const [alertMessage,setAlertMessage] = React.useState("")

    const [tag,setTag] = React.useState([

    ])
    const [tagMemberOptions,setTagMemberOptions] = React.useState([

    ])
    function isNotNull(value){
        if(value != null && value.length >0  )
        return true
        else 
        return false
    }
    function isResponse ( response){
        if(response && response.status == 200)
        return true
        else 
        return false

    }

    const tagMembers= async(key)=>{ 
        let options =[]
        if(key != null){
          let res =   await TagAPI.getMembers(key)
          let tagMembers = await res.data
          let tagMem = []
        if (tagMembers && isNotNull(tagMembers.tagFollowers)) {
        for (let members of tagMembers.tagFollowers) {
            tagMem.push(members.profile.username)
            options.push(<Option value={members.profile.username}>
                {members.profile.username}
        </Option>)
       
        }
    }
       setTagMemberOptions(tagMem)
     }
     return options
     
    }
    const handleClickFavorite = async (slug,selectedOption) => {
        if(isNotNull(slug) && isNotNull(selectedOption)){
        if(tagMemberOptions && tagMemberOptions.includes(selectedOption) ){
        mutate(
            `${SERVER_BASE_URL}/tags/${slug}/moderator/${selectedOption}`,
            {},
            true
          );
                let response = await TagAPI.moderators(slug,selectedOption)
                        if(isResponse(response)){
                            alertType = "success"
                            setAlert(true)
                            setAlertMessage("The member "+ selectedOption +" is added as the moderator for the tag "+ value +" successfully")
                        
                        }else{
                           
                            setAlert(true)
                            let responseText = response.data.errors.body[0]
                            alertType = "error"
                            setAlertMessage(responseText)
                           

                        }
                trigger(`${SERVER_BASE_URL}/tags/${slug}/moderator/${selectedOption}`);

          }else{
            alertType = "error"
            setAlertMessage("Member "+ selectedOption +" is not present for the tag "+ value)
            setAlert(true)
            
          }}else{
              alertType = "error"
              if(!isNotNull(slug) ){
                setAlertMessage("Enter a valid tag")

              }else if (!isNotNull(selectedOption)){
                setAlertMessage("Enter a valid member")
              }
               setAlert(true)

          }
    
        };
        

    const onTagClick = async(clicked) => {
        
        setValue(clicked.item.node.innerText)
        setKey(clicked.key)
        setAlert(false)
        let tag = await tagMembers(clicked.key)
        setTag(tag)
    }
    const onSelect = (selectedOption) => {
        
    setSelectedOption(selectedOption.value)
      setAlert(false)
    }
    const onChange = (value) => {
        
        setSelectedOption(value.split("@")[1])
        setAlert(false)
      }
  


    const menu = () => {
        let tagData = []
        for (let tag of props.tags.tags) {
            tagData.push(<Menu.Item key={tag[1]} onClick={onTagClick.bind(tag[1])}>
                {tag[0]}
            </Menu.Item>)
        }
        return (
            <Menu >
                {tagData}</Menu>
        )
    }


    return (
        <div>
            <Dropdown overlay={menu} placement="bottomCenter">
                <Link className="ant-dropdown-link"  >
                    {value} <DownOutlined />
                </Link>
            </Dropdown>
            <SearchDiv> Search Tag Members</SearchDiv>
            <Mentions
               onChange = { onChange}
                onSelect = {onSelect} >
                {tag}
            </Mentions>
            <ButtonStyle  type={"primary"} onClick = {()=> handleClickFavorite(key,selectedOption)}>Make Moderator</ButtonStyle>
            {alert? <AlertStyle message={alertMessage} type={alertType}></AlertStyle> : null}
            
        </div>
    )
}

export default Admin; 