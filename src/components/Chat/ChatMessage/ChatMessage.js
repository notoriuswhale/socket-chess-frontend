import React from "react";
import './ChatMessage.css';


const ChatMessage = (props) => {
    const messageClasses = ["chat__message"];
    const authorClasses = ["chat__author"];
    if(props.message.user === 'admin') messageClasses.push('chat__message-system');
    if(props.message.user === 'WHITE') authorClasses.push('chat__author-white');
    if(props.message.user === 'BLACK') authorClasses.push('chat__author-black');
    return (
                <div className={messageClasses.join(' ')}>
                    <div className={authorClasses.join(' ')}></div>
                    <div className="chat__text">{props.message.text}</div>
                </div>

    );
};


export {ChatMessage};