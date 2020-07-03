import React, {useCallback, useEffect, useReducer, useState} from "react";
import './GamePage.css';
import {Game} from "../Game/Game";
import {Chat} from "../Chat/Chat";
import {socket} from "../../socket"

const CONNECTED = 'CONNECTED';
const DISCONNECTED = 'DISCONNECTED';
const ERROR = 'ERROR';

const initialState = {
    connected: false,
    error: false,
    player: null,
    boardState: null,
    roomId: '',
};

const pageReducer = (state, action) => {
    switch (action.type) {

        case CONNECTED:
            return {
                ...state,
                connected: true,
                player: action.player,
                boardState: action.boardState,
                roomId: action.roomId
            };
        case DISCONNECTED:
            return {
                ...state,
                connected: false
            };
        case ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            throw new Error('GamePage rudecer Error')
    }
};

const GamePage = (props) => {

    const [gamePageState, dispatchgamePage] = useReducer(pageReducer, initialState);

    let [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        console.log('effect');
        let room = new URLSearchParams(props.location.search);
        socket.emit('join', {room: room.get('room')}, (error) => {
            if (error) dispatchgamePage({type: ERROR, error});
        });

        socket.on('connected', ({player, room, boardState}) => {
            dispatchgamePage({
                type: CONNECTED,
                player: player,
                roomId: room,
                boardState: boardState || null
            })
        });

        socket.on('disconnect', ()=>{
            dispatchgamePage({type: DISCONNECTED});
        });


        return (() => {
            socket.emit('disconnect');
            socket.off();
        });
    }, [props.location.search]);

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

    let content = null;

    if (gamePageState.error) {
        content = <div className='error'>{gamePageState.error}</div>
    } else if (!gamePageState.connected) {
        content = <div className='error'>Loading...</div>
    } else {
        content = (
            <div className={'game-page'}>
                {/*<h1>{roomId}</h1>*/}
                <Game player={gamePageState.player} restoredBoardState={gamePageState.boardState}/>
                <Chat sendMessage={sendMessage} chatMessages={chatMessages}/>
            </div>);
    }

    return (
        content
    );
};


export {GamePage};