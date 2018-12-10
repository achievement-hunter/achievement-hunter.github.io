import GameState from "./game-state";
import {GameMechanic} from "./game-mechanic";
import {Achievements} from "./achievement";
import {AchievementPack} from "./achievement-pack";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";

export default class TheDice {
    static unlock() {
        GameState.current.unlockedMechanics.push(GameMechanic.THE_DICE);
        Achievements.unlockPack(AchievementPack.THE_DICE);
        EventHub.dispatch(GameEvent.THE_DICE_UNLOCKED);
        this.buyDie();
        EventHub.dispatch(GameEvent.GAME_MECHANIC_UNLOCKED, GameMechanic.THE_DICE);
    }

    static buyDie() {
        GameState.current.dice++;
        EventHub.dispatch(GameEvent.THE_DICE_NEW_DIE);
    }

    static unlockRoller() {
        GameState.current.diceRollerOn = true;
        EventHub.dispatch(GameEvent.THE_DICE_ROLLER_UNLOCKED);
    }

    static get isUnlocked() {
        return GameState.current.unlockedMechanics.includes(GameMechanic.THE_DICE);
    }
}