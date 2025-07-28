import { FiniteStateMachine } from './FiniteStateMachine.js';
import { EventEmitter } from './EventEmitter.js';

export class SlotMachineEngine {
	constructor(config) {
		this.config = config;
		this.reels = this.config.reels.map(reelConfig => reelConfig.symbols);
		const transitions = {
			'READY': ['SPINNING'],
			'SPINNING': ['EVALUATING'],
			'EVALUATING': ['RESULT'],
			'RESULT': ['READY'],
		};
		this.fsm = new FiniteStateMachine('READY', transitions);
		this.notifier = new EventEmitter();
	}

	on(eventName, callback) { this.notifier.subscribe(eventName, callback); }

	spin() {
		if (this.fsm.getState() !== 'READY') {
			console.log("Engine is not ready to spin.");
			return;
		}
		try {
			this.changeState('SPINNING');
			setTimeout(() => {
				const display = this.generateSpinDisplay();
				this.changeState('EVALUATING');
				const { isWin, winAmount } = this.evaluateWin(display);
				this.changeState('RESULT');
				const result = { display, isWin, winAmount };
				this.notifier.notify('spinCompleted', { result });
				this.changeState('READY');
			}, 500);
		} catch (error) {
			console.error("spin cycle error:", error);
			this.fsm.transitionTo('READY');
			this.notifier.notify('stateChanged', { newState: 'READY' });
		}
	}

	generateSpinDisplay() {
		return this.reels.map(reelSymbols => {
			const randomIndex = Math.floor(Math.random() * reelSymbols.length);
			return [
				reelSymbols[(randomIndex - 1 + reelSymbols.length) % reelSymbols.length],
				reelSymbols[randomIndex],
				reelSymbols[(randomIndex + 1) % reelSymbols.length],
			];
		});
	}

	evaluateWin(display) {
		const winLineSymbols = display.map(reel => reel[this.config.winLine]);
		const firstSymbol = winLineSymbols[0];
		const isWin = winLineSymbols.every(symbol => symbol === firstSymbol);
		if (isWin) { return { isWin: true, winAmount: 100 }; }
		return { isWin: false };
	}
	
	changeState(newState) {
		this.fsm.transitionTo(newState);
		this.notifier.notify('stateChanged', { newState });
	}
}