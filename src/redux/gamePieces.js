import * as constants from "../constants";

export class Pawn {
    constructor(player) {
        this.player = player;
        this.type = 'pawn';
        this.initialPositions = {
            [constants.WHITE]: [48, 49, 50, 51, 52, 53, 54, 55],
            [constants.BLACK]: [8, 9, 10, 11, 12, 13, 14, 15]
        }
    }

    toJSON(){
        // let result = `{player:${this.player},type:${this.type}}`;
        let result = {player: this.player,type: this.type};
        console.log(result);
        return result;
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

export class Rook {
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

export class Bishop {
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

export class Knight {
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

export class Queen {
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

export class King {
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
