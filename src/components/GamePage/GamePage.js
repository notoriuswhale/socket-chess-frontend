import React from "react";
import './GamePage.css';
import {Game} from "../Game/Game";
import {Chat} from "../Chat/Chat";


const GamePage = (props) => {
    return (
        <div className={'game-page'}>
            <Game/>
            <Chat />
        </div>
    );
};


export {GamePage};