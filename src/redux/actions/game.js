import * as actionTypes from './actionTypes'
import {socket} from "../../socket";

export const startGame = (initialState) =>{
    return {
        type: actionTypes.START_GAME,
        initialState,
    }
};

export const restoreGame = (initialState) =>{
    return {
        type: actionTypes.RESTORE_GAME,
        initialState,
    }
};

export const setPlayer = (player) =>{
    return {
        type: actionTypes.SET_PLAYER,
        player,
    }
};

export const move = (position, destination) =>{
    return {
        type: actionTypes.MOVE,
        position,
        destination
    }
};

export const select = (position) =>{
    return {
        type: actionTypes.SELECT,
        selected: position
    }
};

export const unselect = () =>{
    return {
        type: actionTypes.UNSELECT,
    }
};