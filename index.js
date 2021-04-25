// NOTE: Sudoku solver

const axios = require('axios');

const {
    board_1,
    board_2,
    board_3,
    board_4,
    board_5,
    board_6,
    board_7,
    board_8,
    board_9,
    board_10,
} = require('./ques_4x4');


console.log('-------------------------------START-------------------------------');

// let board = [
//     [6 ,1 ,0 ,0 ,0 ,0 ,0 ,9 ,4],
//     [0, 0, 0, 1, 0, 0, 0, 0, 0],
//     [0, 8, 0, 2, 4, 0, 1, 0, 5],
//     [0, 0, 0, 4, 5, 0, 0, 8, 0],
//     [0, 0, 6, 0, 0, 1, 3, 0, 2],
//     [8, 0, 0, 0, 0, 0, 0, 5, 1],
//     [2, 7, 1, 5, 3, 8, 0, 0, 0,],
//     [0, 3, 4, 0, 0, 0, 7, 0, 0],
//     [9, 0, 8, 0, 0, 0, 5, 0, 3],
// ];

let board = board_10;

const possibleNumbers = [1, 2, 3, 4];
const maxRow = 4;
const maxColumn = 4;
const subGridSize = 2;
let boardLookup = [];

const printBoard = (board) => {
    console.log();
    for(let i = 0; i <maxRow; i++) {
        for(let j = 0; j < maxColumn; j++) {
            process.stdout.write(JSON.stringify(board[i][j]) + " ");
        }
        console.log();
    }
    console.log();
}

const findPossibleMoves = (row, column) => {
    const existingMoves = new Set();

    // Row
    for(let i = 0; i < maxRow;  i++) {
        if(board[row][i] !== 0 && i != column) {
            existingMoves.add(board[row][i]);
        }
    }

    // Column
    for(let i = 0; i < maxColumn; i++) {
        if(board[i][column] !== 0 && i !== row) {
            existingMoves.add(board[i][column]);
        }
    }

    // Gotta find out which subGrid and get vals.
    const subGridRowStart = Math.floor(row/subGridSize) * subGridSize;
    const subGridColumnStart = Math.floor(column/subGridSize) * subGridSize;

    for(let i = subGridRowStart; i < subGridRowStart + subGridSize; i++) {
        for(let j = subGridColumnStart; j < subGridColumnStart + subGridSize; j++) {
            if(board[i][j] !== 0 && i  !== row && j !== column) {
                existingMoves.add(board[i][j]);
            }
        }
    }

    const possibleMoves = possibleNumbers.filter(num => !existingMoves.has(num));
    return possibleMoves;
};

const findLastMultipleMovesIndex = () => {
    let lastMultipleMovesIndex;

    for(let i = boardLookup.length - 1; i >= 0 ; i--) {
        const currentSquare = boardLookup[i];
        if(currentSquare.possibleMoves.length > 1 && currentSquare.currIndex < (currentSquare.possibleMoves.length - 1)) {
            lastMultipleMovesIndex = i;
            break;
        }
    }

    return lastMultipleMovesIndex;
};

const cleanLookupAndBoard = (lastMultipleMovesIndex) => {
    const newBoardLookup = boardLookup.slice(0, lastMultipleMovesIndex + 1);
    // NOTE: Reset removed squares value in board to 0.
    const removedSquares = boardLookup.slice(lastMultipleMovesIndex + 1, boardLookup.length);

    for(let i = 0; i < removedSquares.length; i++) {
        const square = removedSquares[i];
        board[square.row][square.column] = 0;
    }

    return newBoardLookup;
};

// TODO: Nightmare code.
const solver = (board) => {
    let i = 0;
    while(i < maxRow ) {
        let j = 0;
        while(j < maxColumn) {
            console.log('i is : ', i, ' j is: ', j);
            printBoard(board);

            if(board[i][j] === 0) {
                const possibleMoves = findPossibleMoves(i, j);
                if(possibleMoves.length > 0) {
                    const currIndex = 0;
                    // NOTE: Gotta set possibleMoves[0] as first value of square and proceed.
                    boardLookup.push({
                        row: i,
                        column: j,
                        possibleMoves,
                        currIndex,
                    });
                    board[i][j] = possibleMoves[currIndex];

                    console.log('After updating board!');
                    printBoard(board);
                    console.log('boardLookup after insertion: ', boardLookup);
                    console.log('------------------------------\n');

                    j++;
                }
                else {
                    // NOTE: If there's no possibleMoves then something went wrong earlier.
                    // Go back to the index of lookup where there was multiple possibleMoves and
                    // insert next value from it, change i and/or j from that value and continue.
                    console.log('There are no possible moves for : ', i, j);
                    console.log('Gonna backtrack!');

                    const lastMultipleMovesIndex = findLastMultipleMovesIndex();
                    const { row, column, currIndex, possibleMoves } = boardLookup[lastMultipleMovesIndex];

                    console.log('Going to backtrack and change the value of ', row, column, ' from ', possibleMoves[currIndex], ' to ', possibleMoves[currIndex + 1]);

                    board[row][column] = possibleMoves[currIndex + 1];
                    boardLookup[lastMultipleMovesIndex] = {
                        ...boardLookup[lastMultipleMovesIndex],
                        currIndex: currIndex + 1,
                    };

                    // NOTE: Once we find this index, we gotta delete all the entries in lookup after this index
                    // and clean board as they need to be recomputed.
                    boardLookup = cleanLookupAndBoard(lastMultipleMovesIndex);

                    console.log('boardLookup after backtracked: ', boardLookup);
                    console.log('------------------------------\n');

                    i = row;
                    j = column + 1;
                }
            } else {
                console.log('Nothing to update here!');
                console.log('------------------------------\n');
                j++;
            }
        }
        i++;
    }
};


(async () => {
    // Get a random question each time.
    // board = (await axios.get('https://sugoku.herokuapp.com/board?difficulty=easy')).data.board;
    printBoard(board);
    solver(board);
    console.log('Final answer: ')
    printBoard(board);
})();
