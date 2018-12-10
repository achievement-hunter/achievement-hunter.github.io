import {UpgradeDataRecord} from "./game-database/upgrade-data-record";
import {findGameDataById, GameDatabase} from "./game-database/game-database";
import GameState from "./game-state";
import Currency from "./currency";
import EventHub from "../event-hub";
import {GameEvent} from "./game-event";

export class UpgradeInfo {
    public readonly data: UpgradeDataRecord;

    constructor(public readonly id: number) {
        this.data = findGameDataById(GameDatabase.upgrades, id);
    }

    private get gameState() {
        return GameState.current.upgrades;
    }

    get cost() {
        return this.data.cost;
    }

    get isUnlocked() {
        return this.gameState.unlocked.includes(this.id);
    }

    unlock() {
        if (!this.isUnlocked) {
            this.gameState.unlocked.push(this.id);
            EventHub.dispatch(GameEvent.UPGRADE_UNLOCKED, this);
        }
    }

    get isBought() {
        return this.gameState.bought.includes(this.id);
    }

    get isAffordable() {
        return Currency.achievementPoints >= this.cost;
    }

    purchase() {
        if (this.isBought || !this.isAffordable) return false;
        let unlockState = this.gameState.unlocked;
        unlockState.splice(unlockState.indexOf(this.id), 1);
        this.gameState.bought.push(this.id);
        Currency.achievementPoints -= this.cost;
        this.data.purchaseCallback();
        EventHub.dispatch(GameEvent.UPGRADE_PURCHASED, this);
        return true;
    }
}

export default function Upgrade(id: number) {
    return new UpgradeInfo(id);
}

export class Upgrades {
    static get unlockedIds() {
        return GameState.current.upgrades.unlocked;
    }
}