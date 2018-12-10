import GameState from "./game-state";
import {Achievements} from "./achievement";
import {AchievementPack} from "./achievement-pack";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";
import {GameMechanic} from "./game-mechanic";

export default class TheButton {
    static unlock() {
        GameState.current.unlockedMechanics.push(GameMechanic.THE_BUTTON);
        Achievements.unlockPack(AchievementPack.THE_BUTTON);
        EventHub.dispatch(GameEvent.THE_BUTTON_UNLOCKED);
        EventHub.dispatch(GameEvent.GAME_MECHANIC_UNLOCKED, GameMechanic.THE_BUTTON);
    }

    static get isUnlocked() {
        return GameState.current.unlockedMechanics.includes(GameMechanic.THE_BUTTON);
    }
}