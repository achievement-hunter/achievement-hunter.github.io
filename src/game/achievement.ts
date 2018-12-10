import GameState, {AchievementProgressState} from "./game-state";
import {achievementDataMap, GameDatabase} from "./game-database/game-database";
import {AchievementDataRecord} from "./game-database/achievement-data-record";
import Currency from "./currency";
import {AchievementPack} from "./achievement-pack";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";

export class AchievementInfo {
    public readonly data: AchievementDataRecord;

    constructor(public readonly id: number) {
        this.data = achievementDataMap[id];
    }

    get name() {
        return this.data.name;
    }

    private get gameState() {
        return GameState.current.achievements;
    }

    get isUnlocked() {
        return this.gameState.unlocked.includes(this.id);
    }

    unlock() {
        this.gameState.unlocked.push(this.id);
        this.subscribe();
        EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED, this);
        EventHub.multicast(GameEvent.ACHIEVEMENTS_UNLOCKED, this);
    }

    private get progressState() {
        return this.gameState.inProgress.find(s => s.id === this.id);
    }

    private startProgress() {
        const state = new AchievementProgressState(this.id);
        this.gameState.inProgress.push(state);
        return state;
    }

    get progress() {
        const state = this.progressState;
        return state !== undefined ? state.progress : 0;
    }

    set progress(value: number) {
        const goal = this.goal;
        if (value >= goal) {
            this.complete();
            return;
        }
        let state = this.progressState;
        if (state === undefined) {
            state = this.startProgress();
        }
        state.progress = value;
        EventHub.dispatch(GameEvent.ACHIEVEMENT_PROGRESS, this);
    }

    get hasGoal() {
        return this.data.goal !== undefined;
    }

    get goal() {
        const goal = this.data.goal;
        if (goal === undefined) {
            throw `Achievement ${this.name} doesn't have a goal`;
        }
        return goal;
    }

    get progressFraction() {
        return this.progress / this.goal;
    }

    get isCompleted() {
        return this.gameState.completed.includes(this.id);
    }

    complete() {
        if (!this.isUnlocked) return;
        const unlockState = this.gameState.unlocked;
        unlockState.splice(unlockState.indexOf(this.id), 1);
        const progress = this.progressState;
        if (progress !== undefined) {
            this.gameState.inProgress.splice(this.gameState.inProgress.indexOf(progress), 1);
        }
        let completionState = this.gameState.completed;
        if (!completionState.includes(this.id)) {
            completionState.push(this.id);
            this.unsubscribe();
            EventHub.dispatch(GameEvent.ACHIEVEMENT_COMPLETED, this);
            Currency.achievementPoints += this.data.points;
            // 2 === (dummy-ach + the-end-ach)
            if (completionState.length === GameDatabase.achievements.length - 2) {
                Achievements.unlockPack(AchievementPack.THE_END);
                EventHub.dispatch(GameEvent.THE_END);
            }
        }
    }

    public subscribe() {
        let events = this.data.events;
        if (events !== undefined) {
            for (let event in events) {
                if (events.hasOwnProperty(event)) {
                    EventHub.game.on(<GameEvent>event, events[event], this);
                }
            }
        }
        if (this.data.subscribe !== undefined) {
            this.data.subscribe(this);
        }
    }

    public unsubscribe() {
        let events = this.data.events;
        if (events !== undefined) {
            for (let event in events) {
                if (events.hasOwnProperty(event)) {
                    // Don't use offAll, because this function could be called from other instance
                    EventHub.game.off(<GameEvent>event, events[event]);
                }
            }
        }
        if (this.data.unsubscribe !== undefined) {
            this.data.unsubscribe(this);
        }
    }
}

export default function Achievement(id: number) {
    return new AchievementInfo(id);
};

export class Achievements {
    static get allIds() {
        return GameDatabase.achievements.map(a => a.id);
    }

    static unlockPack(pack: AchievementPack) {
        EventHub.startMulticast(GameEvent.ACHIEVEMENTS_UNLOCKED);
        const data = GameDatabase.achievements;
        for (let i = 0; i < data.length; i++) {
            let achievement = data[i];
            if (achievement.pack === pack) {
                Achievement(achievement.id).unlock();
            }
        }
        EventHub.endMulticast(GameEvent.ACHIEVEMENTS_UNLOCKED);
    }

    static completePack(pack: AchievementPack) {
        const data = GameDatabase.achievements;
        for (let i = 0; i < data.length; i++) {
            let achievement = data[i];
            if (achievement.pack === pack) {
                Achievement(achievement.id).complete();
            }
        }
    }

    static get unlocked() {
        return GameState.current.achievements.unlocked.map(Achievement);
    }

    static subscribeUnlocked() {
        for (let ach of this.unlocked) {
            ach.subscribe();
        }
    }
}