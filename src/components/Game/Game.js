import React, { useEffect } from "react";
import { Board } from "../Board/Board";
import * as constants from "../../constants";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
    gameStateSelector,
    isCheckedSelector,
    possibleMovesSelector,
} from "../../redux/reducers/gameReducer";
import {
    move,
    restoreGame,
    select,
    setPlayer,
    startGame,
    unselect,
} from "../../redux/actions/game";

const Game = ({ player: playerId, restoredBoardState }) => {
    let board = useSelector((state) => state.game.board);
    let whoMoves = useSelector((state) => state.game.whoMoves);
    let enemy = useSelector((state) => state.game.enemy);
    let player = useSelector((state) => state.game.player);

    let gameState = useSelector((state) => gameStateSelector(state.game));
    let isChecked = useSelector((state) => isCheckedSelector(state.game));
    let [selected, possibleMoves] = useSelector((state) => [
        state.game.selected,
        possibleMovesSelector(state.game),
    ]);
    let boardDispatch = useDispatch();

    useEffect(() => {
        if (board.length === 0) {
            if (restoredBoardState)
                boardDispatch(restoreGame(restoredBoardState));
            else boardDispatch(startGame());
        }
        const onMove = ({ position, destination }) => {
            console.log("moved");
            boardDispatch(move(position, destination));
        };
        socket.on("move", onMove);

        return () => {
            socket.off("move", onMove);
        };
    }, [boardDispatch, board, restoredBoardState, whoMoves, enemy, player]);

    useEffect(() => {
        boardDispatch(setPlayer(playerId));
    }, [boardDispatch, playerId]);

    useEffect(() => {
        if (player === enemy)
            socket.emit(
                "updateBoardState",
                { board, whoMoves, enemy },
                () => {}
            );
    }, [board, enemy, player, whoMoves]);

    const onClickHandler = (index) => {
        // if game ended do nothind
        if (gameState === constants.DONE || player !== whoMoves) return;
        //if not selected and there is a pice on square then select
        if (selected === null && board[index]?.player === whoMoves) {
            boardDispatch(select(index));
            return;
        }
        //if selected piece of the same player then reselect
        if (
            board[index]?.player === board[selected]?.player &&
            index !== selected
        ) {
            boardDispatch(select(index));
            return;
        }
        if (index === selected || !possibleMoves.includes(index)) {
            // if clicked on selected piece or illegal move then deselect
            boardDispatch(unselect());
        }

        // else move piece
        else {
            socket.emit(
                "move",
                {
                    position: selected,
                    destination: index,
                },
                () => {}
            );
        }
    };

    return (
        <>
            <Board
                squares={board}
                possibleMoves={possibleMoves}
                onClickHandler={onClickHandler}
                isChecked={isChecked}
                player={player}
            />
            {gameState && (
                <div>
                    GAME ENDED: {enemy === constants.WHITE ? "WHITE" : "BLACK"}{" "}
                    WINS
                </div>
            )}
        </>
    );
};

// let memoGame = React.memo(Game);
export { Game };
