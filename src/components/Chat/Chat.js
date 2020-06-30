import React, {useCallback, useEffect, useRef, useState} from "react";
import './Chat.css';
import {ChatMessage} from "./ChatMessage/ChatMessage";
import {ChatHeader} from "./ChatHeader/ChatHeader";
import {ChatControls} from "./ChatControls/ChatControls";


const Chat = (props) => {

    let inputRef = useRef(null);
    let messagesEndRef = useRef(null);

    let [chatMessages, setChatMessages] = useState([]);
    let [chatMessage, setChatMessage] = useState('');

    const onChange = useCallback((event) => {
        setChatMessage(event.target.value);
    }, []);

    const onSend = useCallback((event) => {
        if (chatMessage.trim().length !== 0) {
            setChatMessages([...chatMessages, chatMessage]);
            setChatMessage('');
            inputRef.current.focus();
        }

    }, [chatMessage, chatMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(scrollToBottom, [chatMessages]);


    return (
        <div className="chat">
            <ChatHeader>Chat</ChatHeader>
            <div className="chat__messages">
                {chatMessages.map((v, i) =>{
                    return <ChatMessage key={v+i}>{v}</ChatMessage>;
                })}
                <div ref={messagesEndRef} />
            </div>
            <ChatControls onSend={onSend}
                          onChange={onChange}
                          chatMessage={chatMessage}
                          inputRef={inputRef}/>
        </div>
    );
};


export {Chat};