// NOTE: Sudoku solver

const findPossibleMoves = (row, column, board, sudokuSize, subGridSize) => {
    const existingMoves = new Set();
    const possibleNumbers = sudokuSize === 4 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4];

    // Row
    for(let i = 0; i < sudokuSize;  i++) {
        if(board[row][i] !== 0 && i != column) {
            existingMoves.add(board[row][i]);
        }
    }

    // Column
    for(let i = 0; i < sudokuSize; i++) {
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

const findLastMultipleMovesIndex = (boardLookup) => {
    for(let i = boardLookup.length - 1; i >= 0 ; i--) {
        const currentSquare = boardLookup[i];
        if(currentSquare.possibleMoves.length > 1 && currentSquare.currIndex < (currentSquare.possibleMoves.length - 1)) {
            return i;
        }
    }
};

const cleanLookupAndBoard = (lastMultipleMovesIndex, boardLookup, board) => {
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
const solver = (originalBoard) => {
    const board = [...originalBoard];
    const sudokuSize = board.length;
    const subGridSize = Math.sqrt(sudokuSize);
    let boardLookup = [];

    let i = 0;
    while(i < sudokuSize ) {
        let j = 0;
        while(j < sudokuSize) {
            if(board[i][j] === 0) {
                const possibleMoves = findPossibleMoves(i, j, board, subGridSize, subGridSize);
                if(possibleMoves.length > 0) {
                    // NOTE: Gotta set possibleMoves[0] as first value of square and proceed.
                    boardLookup.push({
                        row: i,
                        column: j,
                        possibleMoves,
                        currIndex: 0,
                    });
                    board[i][j] = possibleMoves[0];
                    j++;
                }
                else {
                    // NOTE: If there's no possibleMoves then something went wrong earlier.
                    // Go back to the index of lookup where there was multiple possibleMoves and
                    // insert next value from it, change i and/or j from that value and continue.
                    const lastMultipleMovesIndex = findLastMultipleMovesIndex(boardLookup);
                    const { row, column, currIndex, possibleMoves } = boardLookup[lastMultipleMovesIndex];

                    board[row][column] = possibleMoves[currIndex + 1];
                    boardLookup[lastMultipleMovesIndex] = {
                        ...boardLookup[lastMultipleMovesIndex],
                        currIndex: currIndex + 1,
                    };

                    // NOTE: Once we find this index, we gotta delete all the entries in lookup after this index
                    // and clean board as they need to be recomputed.
                    boardLookup = cleanLookupAndBoard(lastMultipleMovesIndex, boardLookup, board);

                    i = row;
                    j = column + 1;
                }
            } else {
                j++;
            }
        }
        i++;
    }

    return board;
};

module.exports = {
    solver,
};
