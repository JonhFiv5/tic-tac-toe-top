function createGameboard() {
    let board;
    const DEFAULT_CELL_VALUE = null;
    let turnsLeft;

    const generateBoard = () => {
        board = [];
        turnsLeft = 9;
        for (let i = 0; i < 3; i++) {
            board.push([
                DEFAULT_CELL_VALUE,
                DEFAULT_CELL_VALUE,
                DEFAULT_CELL_VALUE,
            ]);
        }
    };

    generateBoard();

    const getGameboard = () => board;

    const assignPlayerMove = (row, column, playerSymbol) => {
        if (board[row][column] === null) {
            board[row][column] = playerSymbol;
            turnsLeft -= 1;
            return true;
        }

        return false;
    };

    const verifyVictory = (playerSymbol) => {
        // Verify diagonal victory
        const diagOne = [board[0][0], board[1][1], board[2][2]];
        const diagTwo = [board[0][2], board[1][1], board[2][0]];

        if (
            diagOne.every((cell) => cell === playerSymbol) ||
            diagTwo.every((cell) => cell === playerSymbol)
        ) {
            return true;
        }

        // Verify row victory
        const rowVictory = board.some((row) =>
            row.every((cell) => cell === playerSymbol)
        );

        // Verify col victory
        const COLUMS = [0, 1, 2];
        const colVictory = COLUMS.some((column) => {
            return (
                board[0][column] === playerSymbol &&
                board[1][column] === playerSymbol &&
                board[2][column] === playerSymbol
            );
        });

        return rowVictory || colVictory;
    };

    const verifyDraw = () => turnsLeft === 0;

    return {
        getGameboard,
        assignPlayerMove,
        verifyVictory,
        verifyDraw,
        generateBoard,
    };
}

function createPlayer(name, symbol) {
    return { name, symbol, score: 0 };
}

function createGame() {
    const gameboard = createGameboard();
    const players = [
        createPlayer('Player One', 'X'),
        createPlayer('Player Two', '0'),
    ];
    let currentPlayer = players[0];
    let gameEnded = false;

    const printGameboard = () => console.table(gameboard.getGameboard());
    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => players;
    const getScores = () => {
        return {
            playerOne: players[0].score,
            playerTwo: players[1].score,
        };
    };

    const playTurn = (row, column) => {
        const successfulMove = gameboard.assignPlayerMove(
            row,
            column,
            currentPlayer.symbol
        );

        if (!successfulMove) {
            console.log('The cell is not empty, try again.');
            return 'Cell is not empty';
        }

        printGameboard();
        const playerWin = gameboard.verifyVictory(currentPlayer.symbol);
        if (playerWin) {
            console.log(`${currentPlayer.name} wins!\nStarting a new game...`);
            currentPlayer.score += 1;
            gameboard.generateBoard();
            return 'Victory';
        }

        const draw = gameboard.verifyDraw();
        if (draw) {
            console.log("It's a draw! No winners, no losers.");
            gameboard.generateBoard();
            return 'Draw';
        }

        currentPlayer =
            currentPlayer.name === players[0].name ? players[1] : players[0];

        return 'Next turn';
    };

    const printCurrentScore = () =>
        console.log(
            `${players[0].name}: ${players[0].score}\n${players[1].name}: ${players[1].score}`
        );

    return {
        playTurn,
        printGameboard,
        printCurrentScore,
        getCurrentPlayer,
        getPlayers,
        getScores,
        gameEnded,
    };
}

function createLayout() {
    // Getting layout elements
    const gameboardContainer = document.querySelector('.gameboard-container');
    const newGameButton = document.querySelector('#new-game-button');
    const gameInfo = document.querySelector('#info');
    const playerOneScore = document.querySelector('#player-one-score');
    const playerTwoScore = document.querySelector('#player-two-score');
    // Creating game objects
    const game = createGame();
    const gameboard = createGameboard();
    const gameboardArray = gameboard.getGameboard();

    playerOneScore.textContent = 0;
    playerTwoScore.textContent = 0;

    // Modal
    const modal = document.querySelector('#endgame-modal');
    const btnClosemodal = document.querySelector('#btn-close-modal');
    btnClosemodal.addEventListener('click', () => modal.close());
    const modalMessage = document.querySelector('#modal-message');

    const displayModal = (message) => {
        modalMessage.textContent = message;
        modal.showModal();
    };

    const buttonCellAction = (button, row, column) => {
        if (!game.gameEnded) {
            const [playerOne, playerTwo] = game.getPlayers();
            const currentPlayer = game.getCurrentPlayer();
            const moveResponse = game.playTurn(row, column);

            if (moveResponse !== 'Cell is not empty') {
                button.innerText = currentPlayer.symbol;
            }

            if (moveResponse === 'Victory') {
                game.gameEnded = true;
                newGameButton.className = '';
                displayModal(`${currentPlayer.name} wins!`);
                const scores = game.getScores();
                playerOneScore.textContent = scores.playerOne;
                playerTwoScore.textContent = scores.playerTwo;
            } else if (moveResponse === 'Draw') {
                game.gameEnded = true;
                newGameButton.className = '';
                displayModal("It's a draw.");
            } else if (moveResponse === 'Next turn') {
                const nextPlayer =
                    currentPlayer.name === playerOne.name
                        ? playerTwo
                        : playerOne;
                gameInfo.textContent = `${nextPlayer.name} turn (${nextPlayer.symbol})`;
            }
        }
    };

    const renderBoard = () => {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                const boardButton = document.createElement('button');
                boardButton.className = 'board-button';
                boardButton.innerText = gameboardArray[row][column];
                boardButton.addEventListener('click', () =>
                    buttonCellAction(boardButton, row, column)
                );
                gameboardContainer.appendChild(boardButton);
            }
        }
    };

    const resetBoard = () => {
        gameInfo.textContent = 'Player one turn';
        game.gameEnded = false;
        const boardButtons = document.querySelectorAll('.board-button');
        boardButtons.forEach((button) => (button.innerHTML = ''));
    };

    newGameButton.addEventListener('click', () => {
        resetBoard();
        newGameButton.className = 'hidden';
    });

    return { renderBoard };
}

// Starts game
const gameLayout = createLayout();
gameLayout.renderBoard();
