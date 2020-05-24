import React from 'react';
import styled from 'styled-components'
import { List, Avatar, Button } from 'antd';

const StyledListItemMeta = styled(List.Item.Meta)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size : 1em;
    flex: none;
    
    .ant-list-item-meta-avatar {
      margin-right: 1.2em;
    }
    .ant-list-item-meta-title {
      font-family: Apercu Pro, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 1.25em;
      line-height: 1.3em;
      margin-bottom: 0.2em;
      color: #000000
    }
    .ant-list-item-meta-description {
      font-family: Open Sans, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 0.8em;
      line-height: 1.2em;
      color: #000000;
    }
`

const User = (props) => {
    return (
    <StyledListItemMeta
        avatar={<Avatar src={props.image} size={50} />}
        title={props.name}
        description={'@' + props.username ||
            <Button
                type={'primary'}
                size={'small'}
                onClick={props.onClick}
                style={{
                    background: props.following ? '#4EC700' : '#007BED',
                    borderColor: props.following ? '#4EC700' : '#007BED',
                    borderRadius: '0.5em',
                    padding: '0em 1em',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                }}>
                {props.following ? 'Following' : '+ Follow'}
            </Button>
        }
    />
)
    }

export default User 