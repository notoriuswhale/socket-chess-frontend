import React, {useEffect, useReducer, useState} from "react";
import {Board} from "../Board/Board";
import {findAllMoves, getAllMoves, getMoves, verifyChecked} from "./helpers/helpers";
import * as constants from './constants';
import {socket} from "../../socket"

class Pawn {
    constructor(player) {
        this.player = player;
        this.type = 'pawn';
        this.initialPositions = {
            [constants.WHITE]: [48, 49, 50, 51, 52, 53, 54, 55],
            [constants.BLACK]: [8, 9, 10, 11, 12, 13, 14, 15]
        }
    }

    isMovePossible(position, destination, isOccupied) {

        let isPossible = false;
        let pieceRow = Math.floor(position / 8);
        let destinationRow = Math.floor(destination / 8);
        let hasMoved = this.initialPositions[this.player].indexOf(position) !== -1;

        if (this.player === constants.WHITE) {
            if ((position - 8 === destination // check if move forvard is possible
                || (hasMoved && position - 16 === destination)) //if first move check if move two squares is possible
                && !isOccupied //
                && (pieceRow - 1 === destinationRow || (hasMoved && pieceRow - 2 === destinationRow))) isPossible = true;    //check if rows is correct, because when pawn is on border it can jump through rows
            if ((position - 9 === destination || position - 7 === destination)
                && isOccupied
                && pieceRow - 1 === destinationRow) isPossible = true; // check if take is possible

        }

        if (this.player === constants.BLACK) {
            if ((position + 8 === destination
                || (hasMoved && position + 16 === destination))
                && !isOccupied
                && (pieceRow + 1 === destinationRow || (hasMoved && pieceRow + 2 === destinationRow))) isPossible = true;
            if ((position + 9 === destination || position + 7 === destination)
                && isOccupied
                && pieceRow + 1 === destinationRow) isPossible = true;

        }
        return isPossible;
    }

    pathToDestination(position, destination) {
        if (destination === position - 16) {
            return [position - 8];
        } else if (destination === position + 16) {
            return [position + 8];
        }
        return [];
    }

}

class Rook {
    constructor(player) {
        this.player = player;
        this.type = 'rook';
    }

    isMovePossible(position, destination) {
        return Rook.checkRookMove(position, destination);
    }

    //pathToDestination need to later check if there is pieces on the way
    pathToDestination(position, destination) {
        return Rook.checkRookPath(position, destination);
    }

    //need static methods because want to reuse it for queen
    static checkRookMove(position, destination) {
        let pieceRow = Math.floor(position / 8);
        let destinationRow = Math.floor(destination / 8);

        let sameCol = Math.abs(position - destination) % 8 === 0;
        let sameRow = pieceRow === destinationRow;

        return sameCol || sameRow;
    }

    static checkRookPath(position, destination) {
        let path = [];
        let [bigger, smaller] = [position, destination].sort((a, b) => b - a);
        let differrence = bigger - smaller;
        if (bigger - smaller < 8) for (let i = differrence - 1; i >= 1; i--) path.push(bigger - i);  //for row
        else for (let i = differrence - 8; i >= 8; i -= 8) path.push(bigger - i); //for col
        return path;
    }

}

class Bishop {
    constructor(player) {
        this.player = player;
        this.type = 'bishop';
    }

    isMovePossible(position, destination) {
        return Bishop.checkBishopMove(position, destination)
    }

    //pathToDestination need to later check if there is pieces on the way
    pathToDestination(position, destination) {
        return Bishop.checkBishopPath(position, destination);
    }

    //need static methods because want to reuse it for queen
    static checkBishopMove(position, destination) {
        let coordY = position % 8;
        let coordX = Math.floor(position / 8);
        let coordY2 = destination % 8;
        let coordX2 = Math.floor(destination / 8);

        if (coordY + coordX === coordY2 + coordX2) {
            return true;
        }
        if (coordY - coordX === coordY2 - coordX2) {
            return true;
        }
    }

    static checkBishopPath(position, destination) {
        let path = [], pathStart, pathEnd, incrementBy;
        if (position > destination) {
            pathStart = destination;
            pathEnd = position;
        } else {
            pathStart = position;
            pathEnd = destination;
        }
        if (Math.abs(position - destination) % 9 === 0) {
            incrementBy = 9;
            pathStart += 9;
        } else {
            incrementBy = 7;
            pathStart += 7;
        }

        for (let i = pathStart; i < pathEnd; i += incrementBy) {
            path.push(i);
        }
        return path;
    }

}

class Knight {
    constructor(player) {
        this.player = player;
        this.type = 'knight';
    }

    isMovePossible(position, destination) {
        let isPossible = false;
        let coordX = position % 8;
        let coordY = Math.floor(position / 8);
        let coordX2 = destination % 8;
        let coordY2 = Math.floor(destination / 8);
        switch (coordY2 * 8 + coordX2) {
            case (coordY - 2) * 8 + (coordX - 1):
            case (coordY - 2) * 8 + (coordX + 1):
            case (coordY - 1) * 8 + (coordX - 2):
            case (coordY - 1) * 8 + (coordX + 2):
            case (coordY + 1) * 8 + (coordX - 2):
            case (coordY + 1) * 8 + (coordX + 2):
            case (coordY + 2) * 8 + (coordX - 1):
            case (coordY + 2) * 8 + (coordX + 1):
                isPossible = true;
                break;
            default:
                isPossible = false;
        }
        if (Math.abs(coordX2 - coordX) > 2) isPossible = false; //need because if on right border can jump to another end of board
        return isPossible
    }

    //pathToDestination need to later check if there is pieces on the way
    pathToDestination() {
        return [];
    }

}

class Queen {
    constructor(player) {
        this.player = player;
        this.type = 'queen';
    }

    isMovePossible(position, destination) {
        return Rook.checkRookMove(position, destination) || Bishop.checkBishopMove(position, destination);
    }

    //pathToDestination need to later check if there is pieces on the way
    pathToDestination(position, destination) {
        if (Rook.checkRookMove(position, destination)) return Rook.checkRookPath(position, destination);
        else return Bishop.checkBishopPath(position, destination);
    }

}

class King {
    constructor(player) {
        this.player = player;
        this.type = 'king';
    }

    isMovePossible(position, destination) {
        let isPossible = false;
        let coordX = position % 8;
        let coordY = Math.floor(position / 8);
        let coordX2 = destination % 8;
        let coordY2 = Math.floor(destination / 8);
        switch (coordY2 * 8 + coordX2) {
            case (coordY + 1) * 8 + (coordX):
            case (coordY) * 8 + (coordX + 1):
            case (coordY + 1) * 8 + (coordX - 1):
            case (coordY - 1) * 8 + (coordX + 1):
            case (coordY + 1) * 8 + (coordX + 1):
            case (coordY - 1) * 8 + (coordX - 1):
            case (coordY - 1) * 8 + (coordX):
            case (coordY) * 8 + (coordX - 1):
                isPossible = true;
                break;
            default:
                isPossible = false;
        }
        if (Math.abs(coordX2 - coordX) > 2) isPossible = false;
        return isPossible;
    }

    //pathToDestination need to later check if there is pieces on the way
    pathToDestination(position, destination) {
        return [];
    }

}

function initializeGame() {
    let squares = new Array(64).fill(null);
    for (let i = 9; i < 17; i++) {
        squares[64 - i] = new Pawn(constants.WHITE);
        squares[i - 1] = new Pawn(constants.BLACK);
    }

    squares[0] = new Rook(constants.BLACK);
    squares[7] = new Rook(constants.BLACK);
    squares[56] = new Rook(constants.WHITE);
    squares[63] = new Rook(constants.WHITE);

    squares[32] = new Queen(constants.WHITE);

    squares[1] = new Knight(constants.BLACK);
    squares[6] = new Knight(constants.BLACK);
    squares[57] = new Knight(constants.WHITE);
    squares[62] = new Knight(constants.WHITE);

    squares[2] = new Bishop(constants.BLACK);
    squares[5] = new Bishop(constants.BLACK);
    squares[58] = new Bishop(constants.WHITE);
    squares[61] = new Bishop(constants.WHITE);

    squares[3] = new Queen(constants.BLACK);
    squares[4] = new King(constants.BLACK);

    squares[59] = new Queen(constants.WHITE);
    squares[60] = new King(constants.WHITE);

    return squares;
}

function restoreGameBoard(board) {

    return board.map((v) => {
        if (!v) return null;
        switch (v.type) {
            case 'pawn':
                return new Pawn(v.player);
            case 'bishop':
                return new Bishop(v.player);
            case 'knight':
                return new Knight(v.player);
            case 'rook':
                return new Rook(v.player);
            case 'queen':
                return new Queen(v.player);
            case 'king':
                return new King(v.player);
            default:
                return null;
        }
    })

}

let initialBoardState = {
    board: initializeGame(),
    whoMoves: constants.WHITE,
    enemy: constants.BLACK,
    player: null,
    isChecked: null,
    kings: {
        [constants.WHITE]: 60,
        [constants.BLACK]: 4
    }
};


const boardReducer = (state, action) => {
    switch (action.type) {
        case constants.MOVE:
            let newBoard = [...state.board];
            newBoard[action.position] = null;
            newBoard[action.destination] = state.board[action.position];
            let kings = {...state.kings};
            if (state.board[action.position].type === 'king') {
                kings[state.whoMoves] = action.destination;
            }
            let isChecked;
            let allEnemyMoves = findAllMoves(newBoard, state.whoMoves);
            if (verifyChecked(allEnemyMoves, state.kings[state.enemy])) {
                isChecked = state.enemy;
            } else isChecked = null;
            return {
                ...state,
                board: newBoard,
                whoMoves: state.enemy,
                enemy: state.whoMoves,
                isChecked: isChecked,
                kings: kings,
            };
        case constants.SET_PLAYER:
            return {...state, player: action.player};
        case 'SET_BOARD':
            let receivedBoard = restoreGameBoard(action.board.board);
            let newKings = {};
            receivedBoard.forEach((v, i) => {
                if (v?.type === 'king') {
                    newKings[v.player] = i;
                }
            });

            let isChecked2;
            let allEnemyMoves2 = findAllMoves(receivedBoard, action.board.whoMoves === constants.WHITE ? constants.BLACK : constants.WHITE);
            if (verifyChecked(allEnemyMoves2, newKings[action.board.whoMoves])) {
                isChecked2 = action.board.whoMoves;
            } else isChecked2 = null;

            return {
                ...state,
                board: receivedBoard,
                whoMoves: action.board.whoMoves,
                enemy: action.board.whoMoves === constants.WHITE ? constants.BLACK : constants.WHITE,
                kings: newKings,
                isChecked: isChecked2,
            };

        default:
            throw new Error('boardReducer error')
    }
};


const Game = ({player, restoredBoardState}) => {
    if (restoredBoardState) {
        initialBoardState = restoredBoardState;
        initialBoardState.player = player;
        initialBoardState.board = restoreGameBoard(restoredBoardState.board)
    }

    let [boardState, boardDispatch] = useReducer(boardReducer, initialBoardState);

    let [selected, setSelected] = useState(null);
    let [gameState, setGameState] = useState(null);

    useEffect(() => {
        socket.emit('startGame', initialBoardState, () => {
            // if (board) boardDispatch({type: 'SET_BOARD', board})
        });

        socket.on('move', ({position, destination}) => {
            boardDispatch({
                type: constants.MOVE,
                position: position,
                destination: destination
            });
            setSelected(null);
        })
    }, []);

    useEffect(() => {
        boardDispatch({type: constants.SET_PLAYER, player});
    }, [player]);

    useEffect(() => {
        if (boardState.player === boardState.enemy) socket.emit('updateBoardState', boardState, () => {
        });
        if (getAllMoves(boardState.board, boardState.whoMoves, boardState.kings[boardState.whoMoves]).length === 0) {
            setGameState(constants.DONE);
        }
    }, [boardState]);


    let possibleMoves = [];

    if (selected !== null) {
        possibleMoves = getMoves(boardState.board, selected, boardState.whoMoves, boardState.kings[boardState.whoMoves]);
    } else possibleMoves = [];

    const onClickHandler = (index) => {
        // if game ended do nothind
        if (gameState === constants.DONE || boardState.player !== boardState.whoMoves) return;
        //if not selected and there is a pice on square then select
        if (selected === null && boardState.board[index]?.player === boardState.whoMoves) {
            setSelected(index);
            return;
        }
        if (boardState.board[index]?.player === boardState.board[selected]?.player && index !== selected) {
            setSelected(index);
            return;
        }
        if ((index === selected || !possibleMoves.includes(index))) {
            // if clicked on selected piece or illegal move then deselect
            setSelected(null);
        }

        // else move piece
        else {
            socket.emit('move', {
                position: selected,
                destination: index,
                whoMoves: boardState.enemy
            }, () => {
            });

            // boardDispatch({
            //     type: constants.MOVE,
            //     position: selected,
            //     destination: index
            // });
            // setSelected(null);
        }
    };
    return (
        <>
            <Board squares={boardState.board} possibleMoves={possibleMoves} onClickHandler={onClickHandler}
                   isChecked={boardState.isChecked} player={boardState.player}/>
            {gameState && <div>GAME ENDED: {boardState.enemy === constants.WHITE ? 'WHITE' : 'BLACK'} WINS</div>}
        </>

    );

};


// let memoGame = React.memo(Game);
export {Game};