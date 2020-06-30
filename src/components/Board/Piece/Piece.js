import React from "react";
import styles from './Piece.module.css'

import pawnWhite from '../../../images/Pawn_White.svg';
import pawnDark from '../../../images/Pawn_Dark.svg';
import bishopWhite from '../../../images/Bishop_White.svg';
import bishopDark from '../../../images/Bishop_Dark.svg';
import kingWhite from '../../../images/King_White.svg';
import kingDark from '../../../images/King_Dark.svg';
import queenWhite from '../../../images/Queen_White.svg';
import queenDark from '../../../images/Queen_Dark.svg';
import knightWhite from '../../../images/Knight_White.svg';
import knightDark from '../../../images/Knight_Dark.svg';
import rookWhite from '../../../images/Rook_White.svg';
import rookDark from '../../../images/Rook_Dark.svg';


const Piece = (props) => {
    let pieceSrc = '';
    switch (props.type) {
        case 'pawn':
            pieceSrc = props.dark ? pawnDark : pawnWhite;
            break;
        case 'bishop':
            pieceSrc = props.dark ? bishopDark : bishopWhite;
            break;
        case 'king':
            pieceSrc = props.dark ? kingDark : kingWhite;
            break;
        case 'queen':
            pieceSrc = props.dark ? queenDark : queenWhite;
            break;
        case 'rook':
            pieceSrc = props.dark ? rookDark : rookWhite;
            break;
        case 'knight':
            pieceSrc = props.dark ? knightDark : knightWhite;
            break;
        default:
    }
    return <img src={pieceSrc} alt="pawn" className={styles.Piece}/>
};

export {Piece}