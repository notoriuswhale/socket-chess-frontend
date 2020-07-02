import * as constants from "../../constants";
import * as actionTypes from "../actions/actionTypes"
import {findAllMoves, getAllMoves, getMoves, initializeGame, verifyChecked} from "../helpers";
import {WHITE} from "../../constants";

let initialBoardState = {
    board: [], //change
    whoMoves: constants.WHITE,
    enemy: constants.BLACK,
    player: null,
    selected: null
};


export const gameReducer = (state = initialBoardState, action) => {
    switch (action.type) {
        case actionTypes.START_GAME:
            return {
                ...state,
                board: initializeGame()
            };
        case actionTypes.RESTORE_GAME:
            return {
                ...state,
                board: initializeGame(action.initialState.board),
                whoMoves: action.initialState.whoMoves,
                enemy: action.initialState.enemy,
                player: action.initialState.player,
                selected: null
            };
        case actionTypes.MOVE:
            let newBoard = [...state.board];
            newBoard[action.position] = null;
            newBoard[action.destination] = state.board[action.position];
            return {
                ...state,
                board: newBoard,
                whoMoves: state.enemy,
                enemy: state.whoMoves,
                selected: null
            };
        case actionTypes.SET_PLAYER:
            return {...state, player: action.player};
        case actionTypes.SELECT:
            return {
                ...state,
                selected: action.selected,
            };
        case actionTypes.UNSELECT:
            return {
                ...state,
                selected: null,
            };
        default:
            return state
    }
};

export const kingsSelector = (state) => {
    let kings = {[constants.WHITE]: null, [constants.BLACK]:null};
    state.board.forEach((piece, index) => {
        if(piece?.type === 'king'){
            kings[piece.player] = index
        }
    });
    return kings;
};

export const isCheckedSelector = (state) => {
    let isChecked;
    let allEnemyMoves = findAllMoves(state.board, state.enemy);
    if (verifyChecked(allEnemyMoves, kingsSelector(state)[state.whoMoves])) {
        isChecked = state.whoMoves;
    } else isChecked = null;
    return isChecked;
};


export const possibleMovesSelector = (state) => {
    if (state.selected !== null) {
        return getMoves(state.board, state.selected, state.whoMoves, kingsSelector(state)[state.whoMoves]);
    } else {
        return [];
    }
};

export const gameStateSelector = (state) => {
    if (getAllMoves(state.board, state.whoMoves, kingsSelector(state)[state.whoMoves]).length === 0) {
        return constants.DONE;
    } else return null;
};





