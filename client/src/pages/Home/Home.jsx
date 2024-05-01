import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Post from '../../components/Post/Post';

import AddPost from '../../components/AddPost/AddPost';
import { Outlet, useSearchParams } from 'react-router-dom';
import './home.scss';

import { Breadcrumb, Layout, Menu, theme, Select, Empty } from 'antd';
import PostService from '../../service/PostService';
import { useCallback } from 'react';

const { Option } = Select;
const { Header, Content, Footer } = Layout;

const filterOptions = [
    {
        value: 'latest',
        label: '最新',
    },
    {
        value: 'oldest',
        label: '最古 ',
    },
    {
        value: 'mostvote',
        label: '最多票',
    },
];
export default function Home() {
    const [posts, setPosts] = useState([]);

    let [searchParams, setSearchParams] = useSearchParams();
    const [filterPost, setFilterPost] = useState('latest');

    const handleGetPost = async () => {
        console.log('[searchParams]', searchParams.get('search'));
        const searchText = searchParams.get('search');
        let posts;
        if (searchText) {
            posts = await PostService.searchPost(searchText);
        } else {
            posts = await PostService.getAllPost();
        }
        console.log('[Home]', posts);
        setPosts(posts);
    };
    useEffect(() => {
        handleGetPost()
    }, [filterPost]);

    const handleDeletePost = useCallback(
        async (postId) => {
            const result = await PostService.deletePost(postId);
            if (result) {
                setPosts((oldPost) => oldPost.filter((post) => post._id !== postId));
            }
        },
        [posts]
    );
    // useEffect(() => {
    //     handleGetPost();
    // }, [searchParams]);
    useEffect(() => {
        handleGetPost();
    }, []);

    return (
        <div className='home-container'>
            <div className='home-filter'>
                <Select defaultValue={filterPost} options={filterOptions} style={{ width: 120 }} onChange={(value) => setFilterPost(value)} />
            </div>
            {posts
                .sort(function (a, b) {
                    if (filterPost === 'latest') {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    } else if (filterPost === 'oldest') {
                        console.log('oldest', new Date(a.createdAt), new Date(b.createdAt));
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    } else if (filterPost === 'mostvote') {
                        return b.likes.length - a.likes.length;
                    }
                })
                ?.map((post) => {
                    console.log('hell', post);
                    return <Post post={post} handleDeletePost={handleDeletePost}></Post>;
                })}

            {
                posts.length <= 0 && <Empty description="結果がありません。" />
            }
        </div>
    );
}
