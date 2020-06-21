import { Avatar, Input, Layout, Button, Badge, Popover } from 'antd';
import { BellOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import Search from "../search/Search";
import Link from 'next/link';
import styled from "styled-components";
import useSWR from "swr";
import storage from "../../lib/utils/storage";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  background-color: #FFFFFF;
  display: flex;
  height: 60px;
  justify-content: "space-between";
  flex-direction: row;
  align-items: center;
  padding: 0px;
`
const LogoButton = styled(Button)`
  color: #000000;
  font-family: Open Sans, sans-serif;
  font-style: normal;
  font-weight: bold;
  height: auto;
  padding: 4px 20px;
  font-size: 25px;
`
const PostButtonStyle = styled(Button)`
  background: #007BED;
  border-radius: 5px;
  height: 38px;
  font-weight: bold;
  color: #FFFFFF;
  padding: 0px 30px;
  font-dize: 17px;
  margin: 0px 25px;
`
const StyledBell = styled(BellOutlined)`
  margin: 0px 20px;
  font-size: 20px;
`
const StyledAvatar = styled(Avatar)`
  height: 40px;
  margin: 0px 25px;
  flex: none;
`
const StyledMenuOutlined = styled(MenuOutlined)`
  margin: 0px 30px;
  font-size: 25px;
`
const InsidePopoverDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const PopoverText = styled.p`
  font-family: Open Sans, sans-serif;
  font-size: 25px;
  font-weight: bold;
`

const content = (
  <InsidePopoverDiv>
    <PopoverText>
      <Link href="/user/login">Sign In</Link> / <Link href="/user/register">Sign Up</Link>
    </PopoverText>
  </InsidePopoverDiv>
);

const Navbar = () => {

  const { data : user } = useSWR("user", storage);

  /*const handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };*/

    return (
      <StyledHeader>
        <LogoButton type="link">Bit Project</LogoButton>
        <Search />
        <Link href="/editor/new">
          <PostButtonStyle>Write a Post</PostButtonStyle>
        </Link>
        <Badge count={1} offset={[-25,5]} dot>
        <StyledBell />
        </Badge>
        {
          user &&
          <StyledAvatar size="large" icon={<UserOutlined />} />
        }
        {
          !user &&
          <Popover
          placement="bottomRight"
          title="pls join..."
          content={content}
          trigger="click"
          arrowPointAtCenter>
            <StyledMenuOutlined />
          </Popover>
        }
      </StyledHeader>
    );
}

export default Navbar;