import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";
import FirebaseService from "../service/FirebaseService";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const {currentUser} =useContext(AuthContext)

 
  useEffect(() => {
 
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if(data && currentUser)
      FirebaseService.handleSeenMessage(data,currentUser)
      doc.exists() && setMessages(doc.data().messages);
      console.log("new mesage",data,currentUser)
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);


  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
