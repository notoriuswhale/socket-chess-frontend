import React from "react";
import './ChatControls.css';


const ChatControls= ({chatMessage, onChange, inputRef, onSend, messageEnd}) => {
    return (
        <div className="chat__controls">
            <input type="text" className="chat__input" value={chatMessage} onChange={onChange} onKeyDown={event => event.key === 'Enter' ? onSend() : null} ref={inputRef}/>
            <buttton className="btn chat__btn-send" onClick={onSend}>Send</buttton>
        </div>
    );
};


export {ChatControls};