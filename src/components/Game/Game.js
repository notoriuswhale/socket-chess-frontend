import React, {useEffect, useReducer, useState} from "react";
import {Board} from "../Board/Board";
import {findAllMoves, getAllMoves, getMoves, verifyChecked} from "../../redux/helpers";
import * as constants from '../../constants';
import {socket} from "../../socket"
import {useDispatch, useSelector} from "react-redux";
import {
    gameStateSelector,
    isCheckedSelector,
    kingsSelector,
    possibleMovesSelector
} from "../../redux/reducers/gameReducer";
import {move, restoreGame, select, setPlayer, startGame, unselect} from "../../redux/actions/game";



const Game = ({player, restoredBoardState}) => {
    // if (restoredBoardState) {
    //     initialBoardState = restoredBoardState;
    //     initialBoardState.player = player;
    //     initialBoardState.board = restoreGameBoard(restoredBoardState.board)
    // }
    let boardState = useSelector(state => {
        return {
            board: state.game.board,
            whoMoves: state.game.whoMoves,
            enemy: state.game.enemy,
            player: state.game.player,
            gameState: gameStateSelector(state.game),
        }
    });
    let isChecked = useSelector(state => isCheckedSelector(state.game));
    let [selected, possibleMoves] = useSelector(state => [state.game.selected, possibleMovesSelector(state.game)]);
    let boardDispatch = useDispatch();

    console.log(kingsSelector(boardState));
    // let [boardState, boardDispatch] = useReducer(boardReducer, initialBoardState);

    // let [selected, setSelected] = useState(null);
    // let [gameState, setGameState] = useState(null);

    useEffect(() => {
        if(boardState.board.length === 0){
            if(restoredBoardState) boardDispatch(restoreGame(restoredBoardState));
            else boardDispatch(startGame());
            socket.emit('startGame', restoredBoardState || boardState, () => {
                // if (board) boardDispatch({type: 'SET_BOARD', board})
            });
        }
        const onMove = ({position, destination}) => {
            console.log('moved');
            boardDispatch(move(position, destination));
        };
        socket.on('move', onMove);

        return () =>{
            socket.off('move', onMove);
        }
    }, [boardDispatch, boardState, restoredBoardState]);

    useEffect(() => {
        boardDispatch(setPlayer(player));
    }, [boardDispatch, player]);

    useEffect(() => {
        if(boardState.whoMoves === boardState.player) socket.emit('updateBoardState', boardState, () => {});
    }, [boardState.board]);




    const onClickHandler = (index) => {
        // if game ended do nothind
        if (boardState.gameState === constants.DONE || boardState.player !== boardState.whoMoves) return;
        //if not selected and there is a pice on square then select
        if (selected === null && boardState.board[index]?.player === boardState.whoMoves) {
            boardDispatch(select(index));
            return;
        }
        //if selected piece of the same player then reselect
        if (boardState.board[index]?.player === boardState.board[selected]?.player && index !== selected) {
            boardDispatch(select(index));
            return;
        }
        if ((index === selected || !possibleMoves.includes(index))) {
            // if clicked on selected piece or illegal move then deselect
            boardDispatch(unselect());
        }

        // else move piece
        else {
            socket.emit('move', {
                position: selected,
                destination: index,
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
                   isChecked={isChecked} player={boardState.player}/>
            {boardState.gameState && <div>GAME ENDED: {boardState.enemy === constants.WHITE ? 'WHITE' : 'BLACK'} WINS</div>}
        </>

    );

};


// let memoGame = React.memo(Game);
export {Game};