import React from "react";
import styles from './Square.module.css'
import {Piece} from "../Piece/Piece";

const Square = (props) => {
    let classes = [styles.Square];
    props.isLight ? classes.push(styles.light) : classes.push(styles.dark);

    if(props.pieceType === 'king'){
        if(props.dark && props.isChecked === 2) classes.push(styles.red)
        if(!props.dark && props.isChecked === 1) classes.push(styles.red)
    }

    return (
        <div className={classes.join(' ')} onClick={props.onClickHandler}>
            {/*{props.index}*/}
            {props.pieceType && <Piece type={props.pieceType} dark={props.dark}/>}
            {props.isPossible && <div className={styles.Dot}></div>}
        </div>
    );
};

export {Square};