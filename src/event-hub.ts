import {GameEvent} from "./game/game-event";

export default class EventHub {
    private handlers: { [event: string]: EventRegistration[] } = {};
    private multicasts: { [event: string]: any[] } = {};
    currentTarget: any;

    on(event: GameEvent, handler: Function, target: any, once = false) {
        let handlers = this.handlers[event];
        if (handlers === undefined) {
            handlers = [];
            this.handlers[event] = handlers;
        }
        handlers.push(new EventRegistration(target, handler, once));
    }

    off(event: GameEvent, handler: Function) {
        const handlers = this.handlers[event];
        if (handlers === undefined) return;
        this.handlers[event] = handlers.filter(h => h.handler !== handler);
    }

    offAll(target: any) {
        for (let key in this.handlers) {
            if (this.handlers.hasOwnProperty(key)) {
                this.handlers[key] = this.handlers[key].filter(h => h.target !== target);
            }
        }
    }

    emit(event: GameEvent, ...args: any[]) {
        const handlers = this.handlers[event];
        if (handlers === undefined) return;
        for (let registration of handlers) {
            this.currentTarget = registration.target;
            registration.handler(...args);
            this.currentTarget = undefined;
        }
        this.handlers[event] = this.handlers[event].filter(h => !h.once);
    }

    multicast(event: GameEvent, arg: any) {
        const multicast = this.multicasts[event];
        if (multicast === undefined) {
            this.emit(event, [ arg ]);
        }
        else {
            multicast.push(arg);
        }
    }

    startMulticast(event: GameEvent) {
        this.multicasts[event] = [];
    }

    endMulticast(event: GameEvent) {
        const multicast = this.multicasts[event];
        this.multicasts[event] = [];
        this.emit(event, multicast);
    }

    static game = new EventHub();
    static ui = new EventHub();

    static dispatch(event: GameEvent, ...args: any[]) {
        EventHub.game.emit(event, ...args);
        EventHub.ui.emit(event, ...args);
    }

    static multicast(event: GameEvent, arg: any) {
        EventHub.game.multicast(event, arg);
        EventHub.ui.multicast(event, arg);
    }

    static startMulticast(event: GameEvent) {
        EventHub.game.startMulticast(event);
        EventHub.ui.startMulticast(event);
    }

    static endMulticast(event: GameEvent) {
        EventHub.game.endMulticast(event);
        EventHub.ui.endMulticast(event);
    }
}

class EventRegistration {
    constructor(public target: any, public handler: Function, public once: boolean) { };
}