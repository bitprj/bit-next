import React from 'react'
import User from './User'
import styled from 'styled-components'
import { List, Button } from 'antd'

const StyledListItem = styled(List.Item)`
    font-size: 0.85em;
    width: 100%;
    padding: 2em;
    margin: 1.5em auto;
    border-radius: 0.6em;
    background: #FFFFFF;
`

const FollowerList = props => (
    <List
        itemLayout="horizontal"
        dataSource={props.followers}
        renderItem={follower => (
            <StyledListItem>
                <User
                    name={follower['name']}
                    image={follower['image']}
                    username={follower['username']}
                    following={follower['following']}
                    onClick={follower['onClick']}
                >
                </User>
                <Button
                    type={'primary'}
                    size={'middle'}
                    onClick={props.onClick}
                    style={{
                        background: follower['following'] ? '#DD2E44' : '#007BED',
                        borderColor: follower['following'] ? '#DD2E44' : '#007BED',
                        borderRadius: '0.5em',
                        padding: '0em 1em',
                        fontSize: '1em',
                        fontWeight: 'bold',
                    }}>
                    {follower['following'] ? 'Delete' : '+ Follow'}
                </Button>
            </StyledListItem>
        )}
    />
);

export default FollowerList