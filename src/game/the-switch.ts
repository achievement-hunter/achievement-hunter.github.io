import GameState from "./game-state";
import {GameMechanic} from "./game-mechanic";
import {Achievements} from "./achievement";
import {AchievementPack} from "./achievement-pack";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";

export default class TheSwitch {
    static unlock() {
        GameState.current.unlockedMechanics.push(GameMechanic.THE_SWITCH);
        Achievements.unlockPack(AchievementPack.THE_SWITCH);
        EventHub.dispatch(GameEvent.THE_SWITCH_UNLOCKED);
        EventHub.dispatch(GameEvent.GAME_MECHANIC_UNLOCKED, GameMechanic.THE_SWITCH);
    }

    static get isUnlocked() {
        return GameState.current.unlockedMechanics.includes(GameMechanic.THE_SWITCH);
    }
}