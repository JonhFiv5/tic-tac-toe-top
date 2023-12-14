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

function createGame() {
    const gameboard = createGameboard();
    const players = [
        {
            name: 'player one',
            symbol: 'X',
            score: 0,
        },
        {
            name: 'player two',
            symbol: 'O',
            score: 0,
        },
    ];
    let currentPlayer = players[0];

    const printGameboard = () => console.table(gameboard.getGameboard());

    const playTurn = (row, column) => {
        const successfulMove = gameboard.assignPlayerMove(
            row,
            column,
            currentPlayer.symbol
        );

        if (!successfulMove) {
            console.log('The cell is not empty, try again.');
            return;
        }

        printGameboard();
        const playerWin = gameboard.verifyVictory(currentPlayer.symbol);
        if (playerWin) {
            console.log(`${currentPlayer.name} wins!\nStarting a new game...`);
            currentPlayer.score += 1;
            gameboard.generateBoard();
            return;
        }

        const draw = gameboard.verifyDraw();
        if (draw) {
            console.log("It's a draw! No winners, no losers.");
            gameboard.generateBoard();
            return;
        }

        currentPlayer =
            currentPlayer.name === 'player one' ? players[1] : players[0];
    };

    const printCurrentScore = () =>
        console.log(
            `Player one: ${players[0].score}\nPlayer two: ${players[1].score}`
        );

    return { playTurn, printGameboard, printCurrentScore };
}

const game = createGame();
