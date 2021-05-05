<script>
	import Board from '../components/Board.svelte';
</script>

<main>
	<h1>Sudoku!</h1>
	<Board boardSize={4} />
</main>

<style>

	:global(body) {
        background-color: #353839;
        color: #bfc2c7;
    }

	main {
		display: flex;
		flex-direction: column;
   		justify-content: center;
		align-items: center;
		text-align: center;
		max-width: 240px;
	}

	h1 {
		color: #629924;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>