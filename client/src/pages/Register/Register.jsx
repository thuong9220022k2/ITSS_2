import React, { useState } from 'react';
import Add from '../../img/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Card, Avatar, Space, Button, Modal, Form, Input, message } from 'antd';

const Register = () => {
  const [err, setErr] = useState(false);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const navigate = useNavigate();

  const handleSubmit = async values => {
    setLoading(true);
    const { displayName, email, password } = { ...values };
    const file = selectedFile;

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async downloadURL => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            }).catch(err => console.log(err));

            //create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {});
        message.open({type:"success",content:"アカウントの登録が成功しました。"})
            
            navigate('/');
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
        message.open({type:"error",content:"何かエラーが発生しました。もう一度お試しください。"})
      setErr(true);
      setLoading(false);
    }
  };
  const handleFileChange = event => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <img className="login-logo" src="/icon/hedspi.png" alt="" />
        <Form
          form={form}
          autoComplete="off"
          onFinish={handleSubmit}
          //   onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="displayName"
            rules={[{ required: true, message: 'このフィールドは必須です。' }]}
          >
            <Input placeholder="表示名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'このフィールドは必須です。' },{type:'email', message:'無効なメールアドレスです。'}]}

          >
            <Input placeholder="メール" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'このフィールドは必須です。' }]}
          >
            <Input placeholder="パスワード" />
          </Form.Item>
         <Form.Item>
         <input
              type="file"
              onChange={handleFileChange}
              id="file"
              style={{ display: 'none' }}
            />
         <label htmlFor="file" className="file-upload">
            {previewUrl && (
              <img className="formContainer-avt" src={previewUrl} alt="" />
            )}
            <div className="upload-btn">
              <UploadOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />{' '}
              アバターをアップロード
            </div>
          </label>
         </Form.Item>
          <Button
            htmlType="submit"
            size="large"
            type="primary"
            disabled={loading}
            block
          >
            登録
          </Button>
          <p>
            アカウントをお持ちですか？ <Link to="/login">ログイン</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;
