import React, { useCallback, useEffect, useState } from 'react';
import PostService from '../../service/PostService';
import { Button, Dropdown, Space, Avatar, Tag, Divider, Empty, message } from 'antd';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { convertToTimeAgo } from '../../utils/timeUtil';
import { MoreOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

import './approvePost.scss';

export default function ApprovePost() {
    const [posts, setPosts] = useState([]);
    const { listUser } = useContext(UserContext);
    const { currentUser } = useContext(AuthContext);

    const handleApprovePost = async (id, is_approved) => {
        const res = await PostService.approvePost(id, { is_approved });
        if (res) {
            handleGetPost();
            if (is_approved === 'approved') {
                message.open({
                    type: 'success',
                    content: '投稿は承認されました。',
                });
            } else {
                message.open({
                    type: 'success',
                    content: '投稿は拒否されました。',
                });
            }
        }
    };
    const handleGetPost = async () => {
        let newPosts = await PostService.getPendingPosts();
        setPosts(newPosts);
    };
    const handleDeletePost = useCallback(
        async (postId) => {
            const result = await PostService.deletePost(postId);
            if (result) {
                setPosts((oldPost) => oldPost.filter((post) => post._id != postId));
            }
        },
        [posts]
    );
    useEffect(() => {
        handleGetPost();
    }, []);

    return (
        <div className='approve-containter'>
            {posts.map((post) => {
                const postUser = listUser[post.uid];
                return (
                    <div className='post mt-16'>
                        <div className='post-header'>
                            <Space>
                                <Avatar src={postUser?.photoURL}></Avatar>
                                <Space direction='vertical' size={4}>
                                    <div className='post-username'>{postUser?.displayName}</div>
                                    <div className='post-timestamp'>{convertToTimeAgo(post?.createdAt)}</div>
                                </Space>
                            </Space>
                        </div>

                        <div className='post-content' dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <input type='checkbox' name='readmore' id='readmore'></input>

                        <div className='post-tag mt-16'>
                            {post.tags?.map((tag) => {
                                return <Tag>#{tag}</Tag>;
                            })}
                        </div>
                        <Divider style={{ margin: '8px 0' }}></Divider>

                        <div className='post-action'>
                            <Button danger className='mr-8' style={{ flexGrow: 1 }} onClick={() => handleApprovePost(post._id, 'rejected')}>
                                拒否
                            </Button>
                            <Button type='primary' ghost style={{ flexGrow: 1 }} onClick={() => handleApprovePost(post._id, 'approved')}>
                                承認
                            </Button>
                        </div>
                    </div>
                );
            })}
            {posts.length <= 0 && <Empty description={'現在は審査待ちの投稿はありません。'} />}
        </div>
    );
}
