import * as constants from "../constants";
import {Bishop, King, Knight, Pawn, Queen, Rook} from "./gamePieces";

const filterLegalMoves = (board, position, destination) => {
    let legalMove = true;
    let pathToDestination = board[position].pathToDestination(position, destination);
    for (let index of pathToDestination) {
        //check if some piece blocks the path
        legalMove = legalMove && !board[index];
    }
    return legalMove
};

//returns all movese for ONE piece including those leading to check
export const findPossibleMoves = (board, piecePosition) => {
    let moves = [];
    if (!board[piecePosition]) return [];
    for (let destination = 0; destination < board.length; destination++) {
        //if pieces on square belong to one player - continue
        if (board[piecePosition]?.player === board[destination]?.player) continue;
        if (board[piecePosition].isMovePossible(piecePosition, destination, Boolean(board[destination]))) {
            if (filterLegalMoves(board, piecePosition, destination)) {
                moves.push(destination);
            }
        }
    }
    return moves;
};

//returns all moves for ALL pieces including those leading to check
export const findAllMoves = (board, player) => {
    let moves = [];
    let enemyPieces = board.filter((val) => val !== null && val.player === player);
    let enemyCoords = enemyPieces.map((v) => board.indexOf(v));

    for (let enemyPiece of enemyCoords) {
        moves.push(findPossibleMoves(board, enemyPiece));
    }

    return [...new Set(moves.flat())];
};


export const verifyChecked = (enemyMoves, king) => {
    return enemyMoves.includes(king);
};


//get all moves for ONE piece EXCLUDING those where you might get cheked
export const getMoves = (board, piece, player, kingPosition) => {
    const enemy = player === constants.WHITE ? constants.BLACK : constants.WHITE;
    let moves = findPossibleMoves(board, piece);
    //if place this filter inside findPossibleMoves then it would be recursion, cuz findAllMoves uses findPossibleMoves;
    //check if move leads to king beeing cheked and removes those moves
    moves = moves.filter((possibleMove) => {

        let newSquares = [...board];
        newSquares[piece] = null;
        newSquares[possibleMove] = board[piece];
        let allEnemyMoves = findAllMoves(newSquares, enemy);

        if (board[piece].type === 'king') return !verifyChecked(allEnemyMoves, possibleMove);
        return !verifyChecked(allEnemyMoves, kingPosition);
    });
    return moves;
};

//get all  moves for all pieces to check if game ended;
export const getAllMoves = (board, player, kingPosition) => {
    let moves = [];
    let myPieces = board.filter((val) => val !== null && val.player === player);
    let myCoords = myPieces.map((v) => board.indexOf(v));

    for (let piece of myCoords) {
        moves.push(getMoves(board, piece, player, kingPosition));
    }
    return moves.flat();
};


export function initializeGame(initialState) {
    if (initialState) return restoreGameBoard(initialState);

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

export function restoreGameBoard(board) {

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