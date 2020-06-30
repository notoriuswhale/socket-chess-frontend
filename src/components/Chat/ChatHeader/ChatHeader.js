import React from "react";
import './ChatHeader.css';


const ChatHeader = (props) => {
    return (
            <h3 className="chat__header">
                {props.children}
            </h3>
    );
};


export {ChatHeader};