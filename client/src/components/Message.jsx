import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { convertTimeStamp, convertToTimeAgo } from '../utils/timeUtil';
import { Tooltip } from 'antd';
const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
            <div className='messageInfo'>{message.senderId !== currentUser.uid ? <img src={data.user.photoURL} alt='' /> : ''}</div>
            <Tooltip className='messageContent' title={convertTimeStamp(message?.date).toUTCString()}>
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt='' />}
            </Tooltip>
        </div>
    );
};

export default Message;
