import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Dropdown, Space, Avatar, Tag, Divider, Popconfirm } from 'antd';
import moment from 'moment';
import { ExclamationCircleFilled, MoreOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { doc, collection, onSnapshot, addDoc, serverTimestamp, setDoc, query, Timestamp, orderBy } from 'firebase/firestore';

import './post.scss';
import { UserContext } from '../../context/UserContext';
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import PostService from '../../service/PostService';
import { NavLink, createSearchParams, useNavigate } from 'react-router-dom';
import { convertTimeStamp, convertToTimeAgo } from '../../utils/timeUtil';

const { confirm } = Modal;
export default function Post({ post, handleDeletePost }) {
    const showDeleteConfirm = () => {
        confirm({
            title: 'この投稿を本当に削除しますか？',
            icon: <ExclamationCircleFilled />,
            content: 'この投稿を永久に削除します。',
            okText: '削除',
            okType: 'danger',
            cancelText: 'キャンセル',
            onOk() {
                handleDeletePost(post._id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const items = [
        {
            label: <NavLink to={`/post/${post._id}/edit`}>投稿を編集</NavLink>,
            key: '0',
        },
        {
            label: (
                <p target='_blank' rel='noopener noreferrer' href='#' onClick={showDeleteConfirm}>
                    削除
                </p>
            ),
            key: '1',
        },
    ];
    const [isChildFocused, setChildFocused] = useState(false);
    const { listUser } = useContext(UserContext);
    const { currentUser } = useContext(AuthContext);
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [listComment, setListComment] = useState([]);
    const postUser = listUser[post.uid];
    const handleChildFocus = () => {
        setChildFocused(true);
    };

    const handleChildBlur = () => {
        setChildFocused(false);
    };

    const handleLike = async () => {
        const { liked } = await PostService.likePost(post._id);
        if(like==1){
            post.likes.push(currentUser.uid);
        }else if(like==-1){
            post.likes.remove(currentUser.uid);

        }
        setLike(like + liked);
        setIsLiked(liked == 1);
    };

    const handleComment = async () => {
        if (comment) {
            console.log('comment', comment);
            const docRef = await addDoc(collection(db, 'posts', post._id, 'comments'), {
                uid: currentUser.uid,
                content: comment,
                timeStamp: serverTimestamp(),
            });
            console.log('Document written with ID: ', docRef.id);
            setComment('');
        }
    };
    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser.uid));
        setLike(post.likes.length);
        
    }, [currentUser.uid, post.likes,post._id]);

    useEffect(() => {
        const q = query(collection(db, 'posts', post._id, 'comments'),orderBy('timeStamp','asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let comments = [];
            querySnapshot.forEach((doc) => {
                comments.push(doc.data());
            });

            setListComment(comments);
            console.log('[list comments]', comments);
        });
        return () => {
            console.log("cancel",post._id)
            unsubscribe();
        };
    }, [post._id]);
    return (
        <div className='post mt-16'>
            <div className='post-header'>
                <Space>
                    <NavLink className='user-link' to={currentUser.uid === post.uid ? 'me' : `/profile/${post.uid}`}>
                        <Avatar src={postUser?.photoURL}></Avatar>
                    </NavLink>
                    <Space direction='vertical' size={4}>
                        <NavLink className='user-link' to={currentUser.uid === post.uid ? '/me' : `/profile/${post.uid}`}>
                            <div className='post-username'>{postUser?.displayName}</div>
                        </NavLink>
                        <div className='post-timestamp'>{convertToTimeAgo(post?.createdAt)}</div>
                    </Space>
                    {post?.is_approved !== 'pending' || <Tag color='gold'>pending</Tag>}
                </Space>
                {currentUser.uid === post.uid ? (
                    <Dropdown
                        className='avatar'
                        placement='bottomRight'
                        menu={{
                            items,
                        }}
                    >
                        <MoreOutlined style={{ fontSize: 24 }} />
                    </Dropdown>
                ) : (
                    ''
                )}
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
                <Space className='post-like'>
                    {isLiked ? (
                        <HeartFilled onClick={handleLike} style={{ fontSize: 24, color: 'red' }} />
                    ) : (
                        <HeartOutlined onClick={handleLike} style={{ fontSize: 24 }} />
                    )}
                    {like}
                </Space>
                <div className='post-comment'>コメント{listComment.length}件 </div>
            </div>
            <Divider style={{ margin: '8px 0' }}></Divider>
            <Space direction='vertical'>
                {listComment.map((comment, id) => {
                    const commentUser = listUser[comment.uid];

                    return (
                        <div className='post-comment-container' key={id}>
                            <NavLink className='user-link' to={currentUser.uid === post.uid ? 'me' : `/profile/${commentUser.uid}`}>
                                <Avatar src={commentUser?.photoURL}></Avatar>
                            </NavLink>
                            <Space direction='vertical' size={4} className='ml-16'>
                                <Space className='post-comments' size={4}>
                                    <NavLink className='user-link post-username' to={currentUser.uid === post.uid ? '/me' : `/profile/${commentUser.uid}`}>
                                        <div className=''>{commentUser?.displayName}</div>
                                    </NavLink>
                                    <p>{comment.content}</p>
                                </Space>
                                <div className='post-timestamp'>{convertToTimeAgo(convertTimeStamp(comment?.timeStamp))}</div>
                            </Space>
                        </div>
                    );
                })}
            </Space>
            <Space className={`post-add `}>
                <Avatar className='add-cmt' src={currentUser?.photoURL}></Avatar>
                <input
                    type='text'
                    value={comment}
                    className={`post-input ${isChildFocused ? 'active' : ''}`}
                    onFocus={handleChildFocus}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                    onBlur={handleChildBlur}
                    placeholder='コメントを入力...'
                />
                <Button type='link' onClick={handleComment}>
                    ポスト
                </Button>
            </Space>
        </div>
    );
}
