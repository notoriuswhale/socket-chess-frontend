import React, {useCallback, useEffect, useRef, useState} from "react";
import './Chat.css';
import {ChatMessage} from "./ChatMessage/ChatMessage";
import {ChatHeader} from "./ChatHeader/ChatHeader";
import {ChatControls} from "./ChatControls/ChatControls";


const Chat = ({sendMessage, chatMessages}) => {

    // let inputRef = useRef(null);
    let messagesEndRef = useRef(null);
    let [chatMessage, setChatMessage] = useState('');
    console.log('chat render');

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    };
    const onChange = useCallback((event) => {
        setChatMessage(event.target.value);
    }, []);

    const emptyField = () => setChatMessage('');

    const onSend = (event) =>{
        sendMessage(chatMessage, emptyField);
    };
    useEffect(scrollToBottom, [chatMessages]);




    return (
        <div className="chat">
            <ChatHeader>Chat</ChatHeader>
            <div className="chat__messages">
                {chatMessages.map((v, i) =>{
                    return <ChatMessage key={v+i} message={v}></ChatMessage>;
                })}
                <div ref={messagesEndRef} />
            </div>
            <ChatControls onSend={onSend}
                          onChange={onChange}
                          chatMessage={chatMessage}
                          // inputRef={inputRef}
            />
        </div>
    );
};


export {Chat};