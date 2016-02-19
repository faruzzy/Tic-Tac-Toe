/**
 * @summary 	Tic Tac Toe
 * @description Quick and Dirty Game Implementation of the Tic Tac Toe Game
 * @version 	0.0.1
 * @file
 * @author 		Roland Pangu
 * @contact 	rolandpangu@outlook.com
 *
 * This is was a side project that I started working on just for fun.
 * Use it as it pleases you!
 * Pull requests are extremely welcome
 */

(function($) {
	var squares = $('.row1 div, .row2 div, .row3 div');
	var rows = $('.row1, .row2, .row3');
	var markCount = 0;
	var lastRowClicked;
	var moveCount = 0;
	var isOver = false;
	var DEBUG = false;
	var rowArray = [];

	if (DEBUG) {
		log('-------Tic Tac Toe--------');
		log('       Game Start         ');
		log('--------------------------');
	}

    /**
     * Returns a Random number in the range between the
     * minimum and max value (both inclusive)
     * @param {integer} min, the minimum value
     * @param {integer} max, the maximum value
     * @returns {integer} a randomly generated value
     */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var game = {
		/**
		 * Entry point of the game
		 */
		start: function() {
			var _self = this ;
			_self.registerEventHandlers();

			if ( DEBUG ) {
				log('Electing First Player..');
			}

			_self.electFirstPlayer();
		},
		select: function() {
			var approach = getRandomInt(0, 1);
			var _self = this;
			if ( approach ) { // either choose to do the next move in the same row
				if ( lastRowClicked.is('.row1') ) {
					return _self.determineSquare(rowArray, 0, 2);
				}

				if ( lastRowClicked.is('.row2') ) {
					return _self.determineSquare(rowArray, 3, 5);
				}

				if ( lastRowClicked.is('.row3') ) {
					return _self.determineSquare(rowArray, 6, 8);
				}
			} else { // or in another row
				if ( lastRowClicked.is('.row1') ) {
					return _self.determineSquare(rowArray, 3, 8);
				}

				// TODO: I see what I was thinking here 
				// but this logic is not the best.. 
				if ( lastRowClicked.is('.row2') ) {
					var exclude = [3, 4, 5];
					var i;
					do {
						i = _self.determineSquare(rowArray, 0, 8);
					} while ( exclude.indexOf(i) > -1 );
				}

				if ( lastRowClicked.is('.row3') ) {
					return _self.determineSquare(rowArray, 0, 5);
				}
			}
		},

		/* Determines wheter the game is over
		 * by looking at the 3 consecutive square rule
		 */
		checkGameOver: function() {
			if ( squares.get(0).textContent !== '' && squares.get(0).textContent === squares.get(1).textContent && squares.get(1).textContent === squares.get(2).textContent ) { isOver = true; return; }
			if ( squares.get(3).textContent !== '' && squares.get(3).textContent === squares.get(4).textContent && squares.get(4).textContent === squares.get(5).textContent ) { isOver = true; return; }
			if ( squares.get(6).textContent !== '' && squares.get(6).textContent === squares.get(7).textContent && squares.get(7).textContent === squares.get(8).textContent ) { isOver = true; return; }

			if ( squares.get(0).textContent !== '' && squares.get(0).textContent === squares.get(3).textContent && squares.get(3).textContent === squares.get(6).textContent ) { isOver = true; return; }
			if ( squares.get(1).textContent !== '' && squares.get(1).textContent === squares.get(4).textContent && squares.get(4).textContent === squares.get(7).textContent ) { isOver = true; return; }
			if ( squares.get(2).textContent !== '' && squares.get(2).textContent === squares.get(5).textContent && squares.get(5).textContent === squares.get(8).textContent ) { isOver = true; return; }

			if ( squares.get(0).textContent !== '' && squares.get(0).textContent === squares.get(4).textContent && squares.get(4).textContent === squares.get(8).textContent ) { isOver = true; return; }
			if ( squares.get(2).textContent !== '' && squares.get(2).textContent === squares.get(4).textContent && squares.get(4).textContent === squares.get(6).textContent ) { isOver = true; return; }
		},

		/**
		 * Register all event handlers to their respective
		 * DOM elements
		 */
		registerEventHandlers: function() {
			var _self = this;
			$(squares).on('click', function(e, param) {
				if ( !isOver ) {
					if ( $(this).text() === '' ) { //if the square is not selected yet

						// get the index of the square clicked
						var index = squares.index(this);
						rowArray[index] = 1;

						var response = _self.getCurrentPlayerMark(markCount);
						$(this).css('color', response[0])
							.addClass('filled')
							.text(response[1]);

						moveCount++;

						markCount++;

						lastRowClicked = $(this).parent();
						if ( param === undefined ) { // the computer didn't initiate the move
							setTimeout(function() {
								_self.computerMove();
							}, 1000);
						}
					} else if ( $(this).text() !== '' ) {
						var i = _self.determineSquare(rowArray);
						$(squares[i]).click();
					}
					_self.checkGameOver();
					if ( DEBUG ) {
						log('click', e.target);
					}
				} else {
					$('.isOver').css('visibility', 'visible');
				}
			});
		},

		/**
		 * Determine who should start first, the computer or the player
		 */
		electFirstPlayer: function() {
			var _self = this;
			var randNumber = getRandomInt(0, 1);

			if ( randNumber ) {
				_self.computerMove(); // the computer initiate the moves
				if ( DEBUG ) {
					log('Computer will start');
				}
			} else {
				if ( DEBUG ) {
					log('User Starts');
				}
			}
		},

		/**
		 * Move initiated by the computer
		 */
		computerMove: function(player) {
			var _self = this;
			var success = false;
			var i;

			if ( lastRowClicked ) {
				success = true;
				$(lastRowClicked.find('div')).each(function(k, v) {
					var filled = $(this).hasClass('filled');
				});
			}

			if ( !success ) { // the computer can randomly click a square
				i = getRandomInt(0, 8); // square index
			} else { // let's think a little
				i = _self.select();
			}

			$(squares[i]).trigger('click', ['COMP']);
		},

		/**
		 * Looks at a row squares, select one of the three squares
		 * if the square has already been clicked, it selects another
		 * one, and returns its index
		 * @param {array}, an array containing 3 indices that represent
		 * the current state of the row.
		 * @example:
		 * [1, 0, 0], first row is already clicked, second and third row are not
		 * clicked yet.
		 * @param {integer}, min, the minimal value to randomly pick from (inclusive)
		 * @param {integer}, max, the maximal value to randomly pick from (inclusive)
		 * @returns {integer}, the selected square index
		 */
		determineSquare: function(rowArray, min, max) {
			var i = getRandomInt(min, max);
			var filled = rowArray[i];

			while ( filled ) {
				i = getRandomInt(min, max);
				filled = rowArray[i];
			}
			return i;
		},

		/**
		 * Returns the current player color and mark,
		 * the first player will be red with a cross 'X'
		 * the second player color will be blue with circle 'O'
		 * @param {string} the Color Counter
		 * @returns {array} an that contains the color and the mark
		 */
		getCurrentPlayerMark: function(markCount) {
			return (markCount % 2 === 0) ? ['red', 'X'] : ['blue', 'O'];
		}
	};

	game.start();
})(jQuery);
