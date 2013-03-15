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
 * Pull request are extremely welcome
 */

(function($) {
	log('-------Tic Tac Toe--------');
	log('       Game Start         ');
	log('--------------------------');

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

	var squares = $('.row1 div, .row2 div, .row3 div');
	var colorCount = 0;
	var lastRowClicked;

	var game = {
		/**
		 * Entry point of the game
		 * Register most Event Handlers
		 */
		start: function() {
			var _self = this ;

			$(squares).on('click', function(e, param) {
				if ( colorCount > 0 && $(this).css('background') !== "" ) { //if the square is not selected yet
					var response = _self.getColor(colorCount);
					$(this).css('color', response[0])
					.text(response[1]);
					colorCount++;

					if ( param === undefined ) { // the computer didn't initiate the move
						_self.computerMove();
					}
				} else if ( colorCount === 0 ) {
					var response = _self.getColor(colorCount);
					$(this).css('color', response[0])
						.addClass('filled')
						.text(response[1]);

					if ( param ) {
						lastRowClicked = $(this).parent();
					}

					colorCount++;
				}

				log('click', e.target);
			});

			log('Electing First Player..');
			_self.electFirstPlayer();
		},

		/**
		 * Determine who should start first, the computer or the player
		 */
		electFirstPlayer: function() {
			var _self = this;
			var randNumber = getRandomInt(0, 1);

			if ( randNumber ) {
				_self.computerMove(); // the computer initiate the moves
				log('Computer will start');
			} else {
				log('User Starts');
			}
		},

		/**
		 * Move initiated by the computer
		 */
		computerMove: function(player) {
			var _self = this;
			var success = false;
			var rowArray = [];
			//var filled;
			var i;

			if ( lastRowClicked && ( lastRowClicked !== $(this).parent() ) ) {
				success = true;
				$(lastRowClicked.find('div')).each(function(k, v) {
					var filled = $(this).hasClass('filled');

					if ( filled ) {
						rowArray.push(1);
					} else {
						rowArray.push(0);
					}
				});
			}

			if ( !success ) { // the computer can randomly click a square
				i = getRandomInt(0, 8); // square index
			} else { // let's think a little
				if ( $(lastRowClicked[0]).is('.row1') ) {
					i = _self.determineSquare(rowArray, 0, 2);
				}

				if ( $(lastRowClicked[0]).is('.row2') ) {
					i = _self.determineSquare(rowArray, 3, 5);
				}

				if ( $(lastRowClicked[0]).is('.row3') ) {
					i = _self.determineSquare(rowArray, 6, 8);
				}
			}

			$(squares[i]).trigger('click', ['COMP']);
		},

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
		 * Returns the user color, the first player will be red
		 * the second player color will be blue
		 * @param {string} the Color Counter
		 * @returns {string} the color
		 */
		getColor: function(colorCount) {
			return (colorCount % 2 === 0) ? ['red', 'X'] : ['blue', 'O'];
		}

	};

	game.start();
})(jQuery);
