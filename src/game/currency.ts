import GameState from "./game-state";
import {GameEvent} from "./game-event";
import EventHub from "../event-hub";

export default class Currency {
    public static get achievementPoints(): number {
        return GameState.current.achievementPoints;
    }

    public static set achievementPoints(value: number) {
        const change = value - this.achievementPoints;
        GameState.current.achievementPoints = value;
        EventHub.dispatch(GameEvent.ACHIEVEMENT_POINTS_CHANGED, change);
    }
}