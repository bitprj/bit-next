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


const { Option } = Mentions;

const Admin = (props) => {
   

    const [value, setValue] = React.useState("Select tag")
    const [key, setKey] = React.useState("")

    const [selectedOption, setSelectedOption] = React.useState()
    const [alert, setAlert] = React.useState(false)
    const [alertMessage,setAlertMessage] = React.useState("")
    const [alertType,setAlertType] = React.useState()
    const [tag,setTag] = React.useState([

    ])
    const [tagMemberOptions,setTagMemberOptions] = React.useState([

    ])
    const tagMembers= async(key)=>{ 
        var options =[]
        if(key != null){
          var res =   await TagAPI.getMembers(key)
          var tagMembers = await res.data
          var tagMem = []
        if (tagMembers && tagMembers.tagFollowers.length > 0) {
        for (var members of tagMembers.tagFollowers) {
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
        
        if(slug != null && selectedOption != null && selectedOption.length != 0 && selectedOption !="@"){
        if(tagMemberOptions && tagMemberOptions.includes(selectedOption) ){
        mutate(
            `${SERVER_BASE_URL}/tags/${slug}/moderator/${selectedOption}`,
            {},
            true
          );
                var response = await TagAPI.moderators(slug,selectedOption)
                        if(response && response.status == 200){
                            
                            setAlert(true)
                            setAlertMessage("The member "+ selectedOption +" is added as the moderator for the tag "+ value +" successfully")
                            setAlertType("success")

                        }else{
                           
                            setAlert(true)
                            var responseText = response.data.errors.body[0]
                        
                            setAlertMessage(responseText)
                            setAlertType("error")
                        }
                trigger(`${SERVER_BASE_URL}/tags/${slug}/moderator/${selectedOption}`);

          }else{
            setAlertMessage("Member "+ selectedOption +" is not present for the tag "+ value)
            setAlert(true)
            setAlertType("error")
          }}else{
              if(slug == null){
                setAlertMessage("Enter a valid tag")

              }else if (selectedOption== null){
                setAlertMessage("Enter a valid member")
              }
               setAlert(true)
               setAlertType("error")

          }
    
        };
        

    const onTagClick = async(clicked) => {
        
        setValue(clicked.item.node.innerText)
        setKey(clicked.key)
        setAlert(false)
        var tag = await tagMembers(clicked.key)
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
        var tagData = []
        for (var tag of props.tags.tags) {
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
                <a className="ant-dropdown-link" style={{
                    border: "1px solid black",
                    padding: '0.5em'
                }} >
                    {value} <DownOutlined />
                </a>
            </Dropdown>
            <div style = {{ width: '100%', marginTop: "2em",fontWeight:"bold" }}> Search Tag Members</div>
            <Mentions
                style={{ marginTop: "2em" }}
               onChange = { onChange}
                onSelect = {onSelect} >
                {tag}
            </Mentions>
            <Button style = {{marginTop: "1em",background:"black" }} type="primary" onClick = {()=> handleClickFavorite(key,selectedOption)}>Make Moderator</Button>
            {alert? <Alert style ={{marginTop: "1em"}} message={alertMessage} type={alertType}></Alert> : null}
            
        </div>
    )
}

export default Admin; 