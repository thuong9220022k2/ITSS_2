import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card, Avatar, Space, Button, Modal, Form, Input } from 'antd';
import { EditOutlined, CameraOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Post from '../../components/Post/Post';
import ReactQuill from 'react-quill';
import './profile.scss';
import PostService from '../../service/PostService';
import { storage } from '../../firebase';
import { UserContext } from '../../context/UserContext';
import { updateProfile } from 'firebase/auth';
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { message } from 'antd';
import { useNavigate, useParams  } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [profile,setProfile]=useState({});
  const { listUser } = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalLike, setTotalLike] = useState(0);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.photoURL);

  const { id } = useParams()
  useEffect(()=>{
    console.log("profile id",id)
    const profile=listUser[id]
    console.log("profile user",profile)
    setProfile(profile);

  },[id,listUser])
  const handleGetPost = async () => {

    let posts = await PostService.getPostByUser(profile.uid);
    console.log('[Profile]', posts);
    setPosts(posts);
  };
  const handleDeletePost = useCallback(
    async postId => {
      const result = await PostService.deletePost(postId);
      if (result) {
        setPosts(oldPost => oldPost.filter(post => post._id !== postId));
      }
    },
    [posts]
  );
 
  useEffect(() => {
    const totalLike = posts.reduce((total, post) => {
      return total + post.likes.length;
    }, 0);
    setTotalLike(totalLike);
  }, [posts]);
  useEffect(() => {
    handleGetPost();
  }, [profile]);
  return (
    <div className="profile-container">
      <Card hoverable={true} className="profile mt-16 mr-16">
        <Space direction="vertical">
          <Space direction="vertical">
            <Avatar src={profile?.photoURL} size={100}></Avatar>
            <Space direction="vertical">
              <h3 className="profile-name">{profile?.displayName} </h3>

              <p>{profile?.email}</p>
            </Space>
          </Space>
         
          <div className="post-info">
            <span className="mr-16">
              <b> {posts.length}</b> 投稿
            </span>
            <span>
              <b>{totalLike}</b> いいね！
            </span>
          </div>
          <div>
            <b>物語:</b>
            <p
              dangerouslySetInnerHTML={{
                __html: listUser[currentUser.uid]?.story,
              }}
            ></p>
          </div>
        </Space>
      </Card>
      <div style={{minWidth:600}}>
        {' '}
        {posts?.map(post => (
          <Post post={post} handleDeletePost={handleDeletePost}></Post>
        ))}

        {
          posts.length <=0 && "投稿はありません。"
        }
      </div>

    </div>
  );
}
