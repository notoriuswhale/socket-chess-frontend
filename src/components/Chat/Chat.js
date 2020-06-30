import React, {useCallback, useRef, useState} from "react";
import './Chat.css';
import {ChatMessage} from "./ChatMessage/ChatMessage";


const Chat = (props) => {

    let messageInput = useRef(null);

    let [chatMessages, setChatMessages] = useState([]);
    let [chatMessage, setChatMessage] = useState('');

    const onChange = useCallback((event) => {
        setChatMessage(event.target.value);
    }, []);

    const onSend = useCallback((event) => {
        if (chatMessage.trim().length !== 0) {
            setChatMessages([...chatMessages, chatMessage]);
            setChatMessage('');
            messageInput.current.focus();
        }

    }, [chatMessage, chatMessages]);

    const onKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            onSend();
        }

    }, [onSend]);


    return (
        <div className="chat">
            <h3 className="chat__header">
                Chat
            </h3>
            <div className="chat__messages">
                {chatMessages.map((v, i) =>{
                    return <ChatMessage key={v+i}>{v}</ChatMessage>;
                })}

            </div>
            <div className="chat__controls">
                <input type="text" className="chat__input" value={chatMessage} onChange={onChange} onKeyDown={onKeyDown} ref={messageInput}/>
                <buttton className="btn chat__btn-send" onClick={onSend}>Send</buttton>
            </div>
        </div>
    );
};


export {Chat};