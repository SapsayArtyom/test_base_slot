export class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    subscribe(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

	unsubscribe(eventName, callback) {
		const eventListeners = this.listeners[eventName];
		if (eventListeners) {
			this.listeners[eventName] = eventListeners.filter(
				listener => listener !== callback
			);
		}
	}

    notify(eventName, payload) {
        const eventListeners = this.listeners[eventName];
        if (eventListeners) {
            eventListeners.forEach(callback => callback(payload));
        }
    }
}