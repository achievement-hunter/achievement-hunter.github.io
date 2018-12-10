import {Achievements} from "./achievement";
import {AchievementPack} from "./achievement-pack";
import GameState from "./game-state";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";
import Currency from "./currency";

export default class Game {
    lastUpdate = 0;

    start() {
        Achievements.unlockPack(AchievementPack.START);
    }

    run() {
        this.setupWindowEvents();
        this.requestUpdate();
        setInterval(() => GameState.save(), 30 * 1000);
    }

    setupWindowEvents() {
        window.onmousemove = e => EventHub.dispatch(GameEvent.MOUSE_MOVE, e);
        window.onmousewheel = () => EventHub.dispatch(GameEvent.MOUSE_WHEEL);
        window.onmouseup = () => EventHub.dispatch(GameEvent.MOUSE_UP);
        window.oncontextmenu = () => EventHub.dispatch(GameEvent.RIGHT_MOUSE_UP);
        window.onfocus = () => EventHub.dispatch(GameEvent.WINDOW_GAINED_FOCUS);
        window.onblur = () => EventHub.dispatch(GameEvent.WINDOW_LOST_FOCUS);
        window.onkeyup = e => EventHub.dispatch(GameEvent.KEY_UP);
    }

    update(time: number) {
        const delta = (time - this.lastUpdate) / 1000;
        this.lastUpdate = time;
        if (GameState.current.pointsGeneratorOn) {
            const points = Currency.achievementPoints;
            Currency.achievementPoints += points < 10 ? 1 : Math.log10(points);
        }
        EventHub.dispatch(GameEvent.UPDATE, delta);
        this.requestUpdate();
    }

    requestUpdate() {
        requestAnimationFrame(this.update.bind(this));
    }
}