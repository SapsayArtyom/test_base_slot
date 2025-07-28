import { SlotMachineEngine } from './SlotMachineEngine.js';

export class Game {
    constructor() {
		this.spinButton = document.getElementById('spin-button');
		this.displayDiv = document.getElementById('slot-display');
		this.messageArea = document.getElementById('message-area');

		const gameConfig = {
			reels: [
				{ symbols: ['🍒', '🍋', '🍊', '🔔', '⭐', '7️⃣', '🍒', '🍋'] },
				{ symbols: ['🍒', '🍋', '🍊', '�', '⭐', '7️⃣', '🔔', '⭐'] },
				{ symbols: ['🍒', '🍋', '🍊', '🔔', '⭐', '7️⃣', '7️⃣', '7️⃣'] },
			],
			winLine: 1,
		};

		this.engine = new SlotMachineEngine(gameConfig);
		this.addListeners();
		this.initDisplay();
	}
	
	initDisplay() {
		const initialDisplay = [['❔'], ['❔'], ['❔']];
		this.displayReels(initialDisplay, 1);
	}

	addListeners() {
		this.spinButton.addEventListener('click', () => {
			this.engine.spin();
		});

		this.engine.on('stateChanged', ({ newState }) => {
			console.log('Состояние изменилось на:', newState);
			if (newState === 'SPINNING') {
				this.spinButton.disabled = true;
				this.messageArea.textContent = 'Барабаны вращаются...';
				this.messageArea.classList.remove('win-message');
			} else if (newState === 'READY') {
				this.spinButton.disabled = false;
			}
		});

		this.engine.on('spinCompleted', ({ result }) => {
			this.displayReels(result.display, this.engine.config.winLine);
			if (result.isWin) {
				this.messageArea.textContent = `ПОБЕДА! Вы выиграли ${result.winAmount} кредитов! 🎉`;
				this.messageArea.classList.add('win-message');
			} else {
				this.messageArea.textContent = 'Попробуйте еще раз!';
			}
		});
	}

	displayReels(display, winLineIndex) {
		this.displayDiv.innerHTML = '';
		
		const transposed = display[0].map((_, colIndex) => display.map(row => row[colIndex]));

		transposed.forEach((row, rowIndex) => {
			row.forEach(symbol => {
				const cell = document.createElement('div');
				cell.className = 'reel-cell';
				cell.textContent = symbol;
				if (rowIndex === winLineIndex) {
					cell.classList.add('win-line');
				}
				this.displayDiv.appendChild(cell);
			});
		});
	}
}