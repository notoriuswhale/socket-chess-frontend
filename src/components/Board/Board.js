import React from "react";
import styles from './Board.module.css'
import {Square} from "./Square/Square";
import * as constants from "../Game/constants";


const Board = (props) => {
    let board = [];
    for (let i = 0; i < 8; i++) {
        let row = [];

        for(let j = 0; j<8; j++){
            row.push( <Square pieceType={props.squares[i*8+j]?.type}
                              index={i*8+j}
                              dark={props.squares[i*8+j]?.player !== constants.WHITE}
                              onClickHandler={() => props.onClickHandler(i*8+j)}
                              isLight={isEven(i) ? isEven(j) : !isEven(j)}
                              isPossible={props.possibleMoves.includes(i*8+j)}
                              isChecked={props.isChecked}
                              key={''+i+j}/> );
        }

        board.push(<div className={styles.Row} key={i}>{row}</div>)
    }
    if (props.player !== constants.WHITE)board.reverse();
    return (
        <div className={styles.Board}>{board}</div>
    );
};

function isEven(num) {
    return num % 2 === 0
}

export {Board};