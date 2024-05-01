import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {Button,Form,Input,message} from 'antd'
import { auth } from "../../firebase";

import "./login.scss"
import { AuthContext } from "../../context/AuthContext";
const Login = () => {
  const [err, setErr] = useState(false);
  const [form]=Form.useForm()
  const navigate = useNavigate();
  const {currentUser} =useContext(AuthContext)
 const checkAuth=async ()=>{
  console.log("hello",currentUser);
  if(currentUser && currentUser?.uid){
    navigate("/home")
  }
 }
  useEffect(()=>{
    checkAuth()
   
  },[currentUser])

  const handleSubmit = async (values) => {
    const {email,password}={...values}
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // message
      navigate("/home")
    } catch (err) {
      message.open({type:"error",content:err.message})
      console.log("login",err)
      setErr(true);
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
            name="email"
            rules={[{ required: true, message: 'このフィールドは必須です。' },{type:'email', message:'無効なメールアドレスです。'}]}
          >
            <Input type="email" placeholder="メール" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'このフィールドは必須です。' }]}
          >
            <Input.Password placeholder="パスワード" />
          </Form.Item>
    
         <Button htmlType="submit" type="primary" size="large" block>ログイン</Button>

          
         
        <p>アカウントをお持ちでないですか？ <Link to="/register">登録する</Link></p>
        </Form>
       
      </div>
    </div>
  );
};

export default Login;
