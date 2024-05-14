"use strict";
;
(function () {
    const gameBoard = (() => {
        let board = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
        let moves = 0;
        function getBoard() {
            return board;
        }
        function updateBoard(position, marker) {
            if (!(marker === "X" || marker === "O") ||
                position[0] > 3 ||
                position[0] < 1 ||
                position[1] > 3 ||
                position[1] < 1) {
                return;
            }
            let [row, column] = position;
            --row;
            --column;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (i == row && j == column) {
                        if (typeof board[i][j] === "number") {
                            board[i][j] = marker;
                            break;
                        }
                        else {
                            return;
                        }
                    }
                }
            }
            moves++;
        }
        function evaluateBoard() {
            if (moves < 5) {
                return;
            }
            let outcome;
            const winConditions = [
                board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O" ? "O" : false,
                board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O" ? "O" : false,
                board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O" ? "O" : false,
                board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O" ? "O" : false,
                board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O" ? "O" : false,
                board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O" ? "O" : false,
                board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O" ? "O" : false,
                board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O" ? "O" : false,
                board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X" ? "X" : false,
                board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X" ? "X" : false,
                board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X" ? "X" : false,
                board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X" ? "X" : false,
                board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X" ? "X" : false,
                board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X" ? "X" : false,
                board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X" ? "X" : false,
                board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X" ? "X" : false,
            ];
            for (let condition of winConditions) {
                if (condition) {
                    outcome = condition;
                    break;
                }
                else if (moves === 9) {
                    outcome = "draw";
                    break;
                }
                else {
                    continue;
                }
            }
            return outcome;
        }
        function resetBoard() {
            board = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
            ];
            moves = 0;
        }
        return { getBoard, updateBoard, evaluateBoard, resetBoard };
    })();
    const gameController = (() => {
        const players = [
            {
                name: "",
                marker: "X",
            },
            {
                name: "",
                marker: "O",
            },
        ];
        function setPlayerNames(name1, name2) {
            players[0].name = name1;
            players[1].name = name2;
        }
        function getPlayers() {
            return players;
        }
        let currentTurn = players[0];
        function getCurrentPlayerTurn() {
            return currentTurn;
        }
        function switchTurn() {
            currentTurn = currentTurn === players[0] ? players[1] : players[0];
            return currentTurn.name;
        }
        function resetPlayerNames() {
            players.forEach((player) => {
                player.name = "";
            });
        }
        function resetTurn() {
            currentTurn = players[0];
        }
        return { getPlayers, setPlayerNames, getCurrentPlayerTurn, switchTurn, resetPlayerNames, resetTurn };
    })();
    const displayController = (() => {
        const playerOneName = document.querySelector('input[name="firstPlayer"]');
        const playerTwoName = document.querySelector('input[name="secondPlayer"]');
        const dialog = document.querySelector("dialog");
        const playButton = document.querySelector('button[type="submit"]');
        const grid = document.querySelector(".grid");
        const gridItems = document.querySelectorAll(".grid > div");
        const text = document.querySelector(".text");
        const resetBtn = document.querySelector("button.reset");
        const restartBtn = document.querySelector("button.restart");
        function getPlayerNames(event) {
            event.preventDefault();
            if (playerOneName.value === "" ||
                playerOneName.value === null ||
                playerTwoName.value === "" ||
                playerTwoName.value === null) {
                alert("Please enter two valid names!");
                return;
            }
            gameController.setPlayerNames(playerOneName.value, playerTwoName.value);
            updateText(text, `${gameController.getCurrentPlayerTurn().name}'s turn!`);
            dialog.close();
        }
        playButton.addEventListener("click", getPlayerNames);
        function updateText(target, string) {
            target.textContent = string;
        }
        function playGame(event) {
            const target = event.target;
            const position = [];
            target.dataset.position.split(" ").forEach((location) => position.push(+location));
            gameBoard.updateBoard(position, gameController.getCurrentPlayerTurn().marker);
            updateText(target, `${gameController.getCurrentPlayerTurn().marker}`);
            gameController.switchTurn();
            updateText(text, `${gameController.getCurrentPlayerTurn().name}'s turn!`);
            gameOutcomeDisplayHandler();
        }
        gridItems.forEach((item) => item.addEventListener("click", playGame, { once: true }));
        function gameOutcomeDisplayHandler() {
            if (gameBoard.evaluateBoard() !== undefined ||
                gameBoard.evaluateBoard() !== "draw" ||
                !gameBoard.evaluateBoard()) {
                if (gameBoard.evaluateBoard() === "X") {
                    updateText(text, `${gameController.getPlayers()[0].name} wins!!`);
                    switchDOMElements();
                }
                else if (gameBoard.evaluateBoard() === "O") {
                    updateText(text, `${gameController.getPlayers()[1].name} wins!!`);
                    switchDOMElements();
                }
                else if (gameBoard.evaluateBoard() === "draw") {
                    updateText(text, "It's a draw!");
                    switchDOMElements();
                }
                else {
                    return;
                }
            }
        }
        function resetGame() {
            gameBoard.resetBoard();
            gameController.resetTurn();
            gridItems.forEach((item) => updateText(item, ""));
            gridItems.forEach((item) => item.addEventListener("click", playGame, { once: true }));
            updateText(text, `${gameController.getCurrentPlayerTurn().name}'s turn!`);
        }
        resetBtn.addEventListener("click", resetGame);
        function switchDOMElements() {
            grid.classList.toggle("none");
            resetBtn.classList.toggle("none");
            restartBtn.classList.toggle("none");
        }
        function restartGame() {
            resetGame();
            gameController.resetPlayerNames();
            updateText(text, "");
            switchDOMElements();
            dialog.showModal();
            playerOneName.value = "";
            playerTwoName.value = "";
        }
        restartBtn.addEventListener("click", restartGame);
        return "Game is ready!";
    })();
    console.log(displayController);
})();
