<script>
	export let boardSize;
    let sudokuBoard = [];
    const allowedValues = [];

    for(let i=0; i < boardSize; i++) {
        sudokuBoard.push([].fill(0, 0, boardSize));
        allowedValues.push(i+1);
    }

    const updateBoard = (value, flattenedPosition) => {
        const row = Math.floor(flattenedPosition/4);
        const col = flattenedPosition % 4;
        if(value && allowedValues.includes(value)) {
            sudokuBoard[row][col] = value;
        }
        else {
            sudokuBoard[row][col] = 0;
        }
    };

    const solveSudoku = async () => {
        const result = await fetch('http://localhost:3000/solve', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                ques: sudokuBoard
            })
        });
        const solution = await result.json();
        sudokuBoard = solution;
	}
</script>

<style>
    .board {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        background-color: white;
        height: 320px;
        width: 320px;
        box-shadow: rgba(0, 0, 0, 0.7) 0px 19px 38px, rgba(0, 0, 0, 0.1) 0px 15px 12px;
        border: 4px solid #006B38FF;
    }

    .square {
        display: flex;
        border-right: 1px solid #C0C0C0;
        border-bottom: 1px solid #C0C0C0;
        height: 80px;
        width: 80px;
        margin: 0;
        text-align: center;
    }

    .right {
        background-color: #629924;
    }

    /* This is the for the subGrid columns */
    .square:nth-child(4n + 3) {
        border-left: solid 2px #2BAE66FF;
    }

    /* This is the for the subGrid rows (Gotta work for a range)*/
    .square:nth-child(n + 9):nth-child(-n + 12) {
        border-top: solid 2px #2BAE66FF;
    }

    .square:hover {
        cursor: pointer;
    }

    .solve {
        margin-top: 5rem;
        border-radius: 10px;
        width: 10rem;
        background-color: #629924;
        color: white;
    }

    .solve:hover {
        cursor: pointer;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>

<div class="board">
    {#each Array(boardSize*boardSize) as _, i}
        <input
            name="solve"
            type=number
            class={`square ${sudokuBoard[Math.floor(i/4)][i%4] > 0 ? 'right': ''}`}
            bind:value={sudokuBoard[Math.floor(i/4)][i % 4]}
            on:blur = {(event) => updateBoard(parseInt(event.target.value), i)}
        />
    {/each}
</div>

<button class="solve" on:click={solveSudoku}>Solve</button>