import { EventEmitter } from "events";

class Client {
	private _subscriptions: {
		[key: string]: BroadcastChannel;
	};
	private _emitter: EventEmitter;
	constructor() {
		this._subscriptions = {};
		this._emitter = new EventEmitter();
	}

	isSupport() {
		return "BroadcastChannel" in self;
	}
	subscribe(topic = "/") {
		if (!this.isSupport()) {
			throw new Error("BroadcastChannel API not supported!");
		}

		if (this._subscriptions[topic]) {
			return this._subscriptions[topic];
		}

		this._subscriptions[topic] = new BroadcastChannel(topic);
		this._subscriptions[topic].onmessage = this._handleOnMessage.bind(this);
		return this._subscriptions[topic];
	}

	_handleOnMessage(args: { data: { eventName: string; payload: any } }) {
		console.log("_handleOnMessage", args);
		const { data } = args;
		const { eventName, payload } = data;
		this._emitter.emit(`${eventName}`, payload);
	}

	on<P>(eventName: string, listener: EventListener<P>) {
		this._emitter.on(eventName, listener);
	}

	once<P>(eventName: string, listener: EventListener<P>) {
		this._emitter.once(eventName, listener);
	}

	off(eventName: string, listener: EventListener) {
		this._emitter.off(eventName, listener);
	}

	isSubscribed(topic: string) {
		return Object.keys(this._subscriptions).includes(topic);
	}

	send<T>(topic = "/", message: T) {
		if (!this.isSupport()) {
			throw new Error("BroadcastChannel API not supported!");
		}
		new BroadcastChannel(topic).postMessage(message);
	}

	publish<T>(topic = "/", message: T) {
		this.send(topic, message);
	}

	disconnect(topic: string) {
		if (topic) {
			this._subscriptions[topic].close();
			delete this._subscriptions[topic];
		} else {
			Object.values(this._subscriptions).forEach((o) => o.close());
			this._subscriptions = {};
		}
	}
}

const broadCastChannel = new Client();

export default broadCastChannel;

export type EventPayload<T> = {
	eventName: string;
	payload: T;
};

type EventListener<T = any> = (v: T) => void;
