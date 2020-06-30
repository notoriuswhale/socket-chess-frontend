import React, {useEffect, useReducer, useState} from "react";
import {Board} from "../Board/Board";
import {findAllMoves, getAllMoves, getMoves, verifyChecked} from "./helpers/helpers";

class Pawn {
    constructor(player) {
        this.player = player;
        this.type = 'pawn';
        this.initialPositions = {
            1: [48, 49, 50, 51, 52, 53, 54, 55],
            2: [8, 9, 10, 11, 12, 13, 14, 15]
        }
    }

    isMovePossible(position, destination, isOccupied) {

        let isPossible = false;
        let pieceRow = Math.floor(position / 8);
        let destinationRow = Math.floor(destination / 8);
        let hasMoved = this.initialPositions[this.player].indexOf(position) !== -1;

        if (this.player === 1) {
            if ((position - 8 === destination // check if move forvard is possible
                || (hasMoved && position - 16 === destination)) //if first move check if move two squares is possible
                && !isOccupied //
                && (pieceRow - 1 === destinationRow || (hasMoved && pieceRow - 2 === destinationRow))) isPossible = true;    //check if rows is correct, because when pawn is on border it can jump through rows
            if ((position - 9 === destination || position - 7 === destination)
                && isOccupied
                && pieceRow - 1 === destinationRow) isPossible = true; // check if take is possible

        }

        if (this.player === 2) {
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
            case (coordY +1) * 8 + (coordX):
            case (coordY ) * 8 + (coordX +1):
            case (coordY +1 ) * 8 + (coordX -1):
            case (coordY - 1) * 8 + (coordX  +1 ):
            case (coordY + 1) * 8 + (coordX  + 1):
            case (coordY - 1) * 8 + (coordX  -1):
            case (coordY  -1 ) * 8 + (coordX ):
            case (coordY ) * 8 + (coordX  -1):
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
        squares[64 - i] = new Pawn(1);
        squares[i - 1] = new Pawn(2);
    }

    squares[0] = new Rook(2);
    squares[7] = new Rook(2);
    squares[56] = new Rook(1);
    squares[63] = new Rook(1);

    squares[32] = new Queen(1);

    squares[1] = new Knight(2);
    squares[6] = new Knight(2);
    squares[57] = new Knight(1);
    squares[62] = new Knight(1);

    squares[2] = new Bishop(2);
    squares[5] = new Bishop(2);
    squares[58] = new Bishop(1);
    squares[61] = new Bishop(1);

    squares[3] = new Queen(2);
    squares[4] = new King(2);

    squares[59] = new Queen(1);
    squares[60] = new King(1);

    return squares;
}

const WHITE = 1;
const DARK = 2;
const DONE = 'DONE';


const initialBoardState = {
    board: initializeGame(),
    whoMoves: WHITE,
    enemy: DARK,
    isChecked: null,
    kings: {
        [WHITE]: 60,
        [DARK]: 4
    }
};


const boardReducer = (state, action) => {
    console.log(state, action);
    switch (action.type) {
        case 'MOVE':
            let newBoard = [...state.board];
            newBoard[action.position] = null;
            newBoard[action.destination] = state.board[action.position];
            let kings = {...state.kings};
            if (state.board[action.position].type === 'king') {
                kings[state.whoMoves] = action.destination;
            }
            console.log(kings);
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
        default:
            throw new Error('boardReducer error')
    }
};


const Game = (props) => {

    let [boardState, boardDispatch] = useReducer(boardReducer, initialBoardState);

    let [selected, setSelected] = useState(null);
    let [gameState, setGameState] = useState(null);

    useEffect(()=> {
        if (getAllMoves(boardState.board, boardState.whoMoves, boardState.kings[boardState.whoMoves]).length === 0) setGameState(DONE);
    }, [boardState]);


    let possibleMoves = [];

    if (selected !== null) {
        possibleMoves = getMoves(boardState.board, selected, boardState.whoMoves, boardState.kings[boardState.whoMoves]);
    } else possibleMoves = [];

    const onClickHandler = (index) => {
        // if game ended do nothind
        if (gameState === DONE) return;
        //if not selected and there is a pice on square then select
        if (selected === null && boardState.board[index]?.player === boardState.whoMoves) {
            setSelected(index);
            return;
        }
        if(boardState.board[index]?.player === boardState.board[selected]?.player && index !== selected){
            setSelected(index);
            return;
        }
        if ((index === selected || !possibleMoves.includes(index))) {
            // if clicked on selected piece or illegal move then deselect
            setSelected(null);
        }

        // else move piece
        else {
            boardDispatch({
                type: 'MOVE',
                position: selected,
                destination: index
            });
            setSelected(null);
        }
    };
    return (
        <>
            <Board squares={boardState.board} possibleMoves={possibleMoves} onClickHandler={onClickHandler}
                   isChecked={boardState.isChecked}/>
            {gameState && <div>GAME ENDED: {boardState.enemy === WHITE ? 'WHITE' : 'BLACK'} WINS</div>}
        </>

    );

};


// let memoGame = React.memo(Game);
export {Game};