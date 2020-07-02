import React, {useCallback, useEffect, useState} from "react";
import './GamePage.css';
import {Game} from "../Game/Game";
import {Chat} from "../Chat/Chat";
import {socket} from "../../socket"



const GamePage = (props) => {
    let [chatMessages, setChatMessages] = useState([]);
    let [connected, setConnected] = useState(false);
    let [error, setError] = useState(true);
    let [player, setPlayer] = useState('');
    let [boardState, setBoardState] = useState(null);

    useEffect(() => {

        socket.emit('join', null, ({error, player, boardState}) => {
            if (error) setError(error);
            else {
                if(boardState) setBoardState(boardState);
                setConnected(true);
                setPlayer(player);
                setError(false);
            }
        });
        return (() => {
            setConnected(false);
            socket.emit('disconnect');
            socket.off();
        });
    }, []);

    const sendMessage = useCallback((message, callback = () => {
    }) => {
        if (message.trim().length !== 0) {
            socket.emit('sendMessage', message, () => {
                callback();
            })
        }

    }, []);

    useEffect(() => {
        let func = (message) => {
            setChatMessages(messages => [...chatMessages, message]);
        };
        socket.on('message', func);

        return () => {
            socket.off('message', func);
        };
    }, [chatMessages]);


    let content;

    if (error || !connected) {
        content = <div className='error'>{error}</div>
    } else {
        content = (
            <div className={'game-page'}>
                <Game player={player} restoredBoardState={boardState}/>
                <Chat sendMessage={sendMessage} chatMessages={chatMessages}/>
            </div>);
    }

    return (
        content
    );
};


export {GamePage};