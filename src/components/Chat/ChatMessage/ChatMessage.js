import React from "react";
import './ChatMessage.css';


const ChatMessage = (props) => {
    return (
                <div className="chat__message">
                    <div className="chat__author"></div>
                    <div className="chat__text">{props.children}</div>
                </div>

    );
};


export {ChatMessage};