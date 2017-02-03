/**
 * @summary 	Tic Tac Toe
 * @description Quick and Dirty Game Implementation of the Tic Tac Toe Game
 * @version 	0.0.1
 * @author 		Roland Pangu
 * @contact 	rolandpangu@outlook.com
 *
 */

(function() {
	let currentPlayer;
	let playerData;
	let cells;

	const $ = (target) => {
		const list = [...document.querySelectorAll(target)];
		return list.length > 1 ? list 
			: list.length > 0 ? list[0] : list;
	};

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function updateCurrentPlayer(player) {
		currentPlayer = player;
		if (player === 'user') {
			return { 
				name: 'user',
				color: 'blue',
				sign: 'X'
			}
		} else {
			return {
				name: 'computer',
				color: 'red',
				sign: 'O'
			}
		}
	}

	const game = {
		start: function() {
			this.registerEvents();
			this.selectPlayer();
			playerData = updateCurrentPlayer(currentPlayer);
			currentPlayer = playerData.name;
			if (currentPlayer === 'computer') 
				this.computerMove();
		},

		computerMove: function() {
			let selectedCell;
			do {
				let idx = getRandomIntInclusive(0, 8);
				selectedCell = cells[idx];
			} while(selectedCell.textContent);
			currentPlayer = 'computer';
			selectedCell.click();
		},

		registerEvents: function() {
			let self = this;
			cells = $('.cell');
			cells.forEach((cell) => {
				cell.addEventListener('click', function() {
					this.textContent = playerData.sign;
					this.style.color = playerData.color;
					if (self.isGameOver()) return;
					if (currentPlayer === 'computer')  {
						playerData = updateCurrentPlayer('user');
					} else {
						playerData = updateCurrentPlayer('computer');
						self.computerMove();
					}
				});
			});
		},

		selectPlayer: function() {
			currentPlayer = getRandomIntInclusive(0, 1) === 1 ? 'computer' : 'user';
		},

		isGameOver: function() {
			let isOver = false;
			let arr = ['X', 'O'];
			for (let c of arr) {
				if ((cells[0].textContent === c && cells[1].textContent === c && cells[2].textContent === c) ||
					(cells[3].textContent === c && cells[4].textContent === c && cells[5].textContent === c) ||
					(cells[6].textContent === c && cells[7].textContent === c && cells[8].textContent === c) ||
					(cells[0].textContent === c && cells[3].textContent === c && cells[6].textContent === c) ||
					(cells[1].textContent === c && cells[4].textContent === c && cells[5].textContent === c) ||
					(cells[2].textContent === c && cells[5].textContent === c && cells[8].textContent === c) ||
					(cells[0].textContent === c && cells[4].textContent === c && cells[8].textContent === c)) {
						$('.title').style.display = 'block';
						if (c === 'X') {
							isOver = true;
							$('.message').textContent = 'You have won!';
							break;
						} else {
							isOver = true;
							$('.message').textContent = 'You have lost!';
							$('.message').style.color = 'red';
							break;
						}
				} 
				return isOver;
			}
		}
	};

	game.start();
})();