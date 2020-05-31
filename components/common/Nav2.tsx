import { Avatar, Input, Layout, Button, Badge } from 'antd';
import { BellOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import Search from "../search/search";
import Link from 'next/link';
import axios from "axios";
import { SERVER_BASE_URL } from "../../lib/utils/constant";

const { Header } = Layout;

async function isLoggedIn() {
  const data = await axios.get(`${SERVER_BASE_URL}/user`, {
    headers: {
      authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTA4Mjc4MjUsIm5iZiI6MTU5MDgyNzgyNSwianRpIjoiYzgxZTRiNDEtNzVhOC00NjZkLWIyYmYtMGZmODA2MGE5MDAyIiwiZXhwIjo4Nzk5MDgyNzgyNSwiaWRlbnRpdHkiOjEsImZyZXNoIjp0cnVlLCJ0eXBlIjoiYWNjZXNzIn0.OF7y4--5PWq3IM0P8kX2Qt_v8kedIwvbGJaos39QQkI'
    }
  });
  console.log(data);
  return data;
}

const Navbar = () => {

  const userData = isLoggedIn();

  const headerStyle = {
    backgroundColor: "#FFFFFF",
    display: "flex",
    height: "60px",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: "0px"
  }

  const logoStyle = {
    color: "#000000",
    fontFamily: "Open Sans, sans-serif",
    fontStyle: "normal",
    fontWeight: "bold",
    height: "auto",
    padding: "4px 20px",
    fontSize: "25px"
  }

  const postStyle = {
    background: "#007BED",
    borderRadius: "5px",
    height: "38px",
    fontWeight: "bold",
    color: "#FFFFFF",
    padding: "0px 30px",
    fontSize: "17px",
    margin: "0px 20px"
  }

  const bellStyle = {
    margin: "5px",
    fontSize: "20px"
  }

  const avatarStyle = {
    height:"40px",
    margin: "0px 25px",
    flex: "none"
 }

 const handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

    return (
      <Header style={headerStyle}>
        <Button type="link"
          style={logoStyle}>Bit Project</Button>
        <Search />
        <Link href="/editor/new">
          <Button style={postStyle}>Write a Post</Button>
        </Link>
        <Badge count={1} offset={[-7,5]} dot>
          <BellOutlined style={bellStyle} />
        </Badge>
        {
          true &&
          <Avatar size="large" icon={<UserOutlined />} style={avatarStyle} />
        }
        {
          false &&
          <MenuOutlined style={{margin: "0px 20px", fontSize: "25px"}} />
        }
      </Header>
    );
}

export default Navbar;
