import EventHub from "../event-hub";
import {GameEvent} from "./game-event";
import {GameMechanic} from "./game-mechanic";

export class AchievementProgressState {
    progress = 0;

    constructor(public readonly id: number) { };
}

class AllAchievementState {
    public unlocked: number[] = [];
    public completed: number[] = [];
    public inProgress: AchievementProgressState[] = [];
}

class UpgradeState {
    public unlocked: number[] = [];
    public bought: number[] = [];
}

export default class GameState {
    public achievementPoints = 0;
    public soundsOn = true;
    public musicOn = false;
    public pointsGeneratorOn = false;
    public lightsOn = true;
    public unlockedMechanics: GameMechanic[] = [];
    public dice = 0;
    public diceRollerOn = false;
    public achievements = new AllAchievementState();
    public upgrades = new UpgradeState();

    public static current = new GameState();

    public static save() {
        localStorage.setItem("save", JSON.stringify(this.current));
        EventHub.dispatch(GameEvent.SAVE);
    }

    public static load() {
        const json = localStorage.getItem("save");
        if (json === null) return false;
        this.current = JSON.parse(json);
        EventHub.dispatch(GameEvent.LOAD);
        return true;
    }

    public static hardReset() {
        if (!confirm("Do you want to hard reset the game? (You won't get an achievement for that)")) {
            EventHub.dispatch(GameEvent.HARD_RESET_ABORT);
            return;
        }
        localStorage.removeItem("save");
        location.reload();
    }
}
