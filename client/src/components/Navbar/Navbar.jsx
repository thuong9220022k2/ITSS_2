import React, { useContext, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { Menu } from 'antd';
import { BiMessageSquareEdit } from 'react-icons/bi';
import { useState } from 'react';
import { AppstoreOutlined, BellOutlined, MessageOutlined, SearchOutlined, HomeOutlined} from '@ant-design/icons';
import { Tooltip, Avatar, Space, Button, Dropdown, Input, Badge } from 'antd';
import './navbar.scss';
import { NavLink, createSearchParams, useNavigate } from 'react-router-dom';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';


const Navbar = () => {
    const { currentUser } = useContext(AuthContext);
    const [current, setCurrent] = useState('mail');
    const [searchText, setSearchText] = useState('');
    const [countUnread, setCountUnread] = useState(0);
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const items = [
        {
            label: <NavLink to={`/me`}>マイプロフィール</NavLink>,
            key: '0',
        },
        {
            label: <NavLink to='/approve-post'>ポスト管理</NavLink>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <NavLink to='/' onClick={() => signOut(auth)}>
                    ログアウト
                </NavLink>
            ),
            key: '2',
        },
    ];
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                let cnt = 0;
                console.log(
                    'chats',
                    Object.values(doc.data()).map((item) => {
                        if (item?.isRead == 0) cnt++;
                    })
                );
                setCountUnread(cnt);
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);
    const navigate = useNavigate();
    const handleSearch = () => {
        navigate(`home?search=${searchText}`, { replace: true });
    };
    return (
        <div className='navbar'>
            
            <NavLink className='navbar-logo' to='/home'>
                <img src='/icon/hedspi.png' alt='' />
            </NavLink>

            <div className='navbar-search'>
                <Input
                    addonAfter={<SearchOutlined onClick={handleSearch} />}
                    placeholder='キーワードやハッシュタグで検索...'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <ul className='navbar-list'>
                <li>
                    <Tooltip title='ホーム'>
                        <NavLink to='/home'>
                            <HomeOutlined style={{ fontSize: '24px' }} />
                        </NavLink>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title='ポスト'>
                        <NavLink to='/create-post'>
                            <BiMessageSquareEdit size={24} />
                        </NavLink>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title='メッセンジャー'>
                        <Badge count={countUnread}>
                            <NavLink to='/messenger'>
                                <MessageOutlined size={24} style={{ fontSize: '22px' }} />
                            </NavLink>
                        </Badge>
                    </Tooltip>
                </li>
                {/* <li>
                    <Tooltip title='Notifications'>
                        <BellOutlined size={24} style={{ fontSize: '24px' }} />
                    </Tooltip>
                </li> */}
                <li>
                    <Dropdown
                        className='avatar'
                        placement='bottomRight'
                        menu={{
                            items,
                        }}
                    >
                        <Space>
                            <Avatar src={currentUser?.photoURL} style={{ verticalAlign: 'middle' }} size='default'>
                                {/* hello */}
                            </Avatar>
                            <p>{currentUser?.displayName}</p>
                        </Space>
                    </Dropdown>
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
