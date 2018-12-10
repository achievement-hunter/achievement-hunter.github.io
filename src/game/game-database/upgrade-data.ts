import {UpgradeDataRecord} from "./upgrade-data-record";
import {Achievements} from "../achievement";
import TheButton from "../the-button";
import {AchievementPack} from "../achievement-pack";
import Upgrade from "../upgrade";
import EventHub from "../../event-hub";
import {GameEvent} from "../game-event";
import GameState from "../game-state";
import TheDice from "../the-dice";
import TheSwitch from "../the-switch";

export default class UpgradeData {
    static create(): UpgradeDataRecord[] {
        return [
            {
                id: 0,
                name: "Dummy upgrade",
                description: "Dummy upgrade",
                cost: 1,
                purchaseCallback: () => {}
            },
            {
                id: 1,
                name: "The Button",
                description: "Unlock The Button",
                cost: 1,
                purchaseCallback: () => {
                    TheButton.unlock();
                }
            },
            {
                id: 2,
                name: "Achievement Pack 1",
                description: "Oh boy, here we go",
                cost: 10,
                purchaseCallback: () => {
                    Achievements.unlockPack(AchievementPack.PACK_1);
                }
            },
            {
                id: 3,
                name: "The Button Pack 1",
                description: "Bonus The Button achievements",
                cost: 15,
                purchaseCallback: () => {
                    Achievements.unlockPack(AchievementPack.THE_BUTTON_PACK_1);
                }
            },
            {
                id: 4,
                name: "The Dice",
                description: "Unlock The Dice",
                cost: 25,
                purchaseCallback: () => {
                    TheDice.unlock();
                }
            },
            {
                id: 5,
                name: "The Dice",
                description: "Unlock Second Die",
                cost: 25,
                purchaseCallback: () => {
                    TheDice.buyDie();
                }
            },
            {
                id: 6,
                name: "The Dice",
                description: "Unlock Third Die",
                cost: 25,
                purchaseCallback: () => {
                    TheDice.buyDie();
                }
            },
            {
                id: 7,
                name: "The Dice-Roller",
                description: "Unlock The Dice-Roller",
                cost: 25,
                purchaseCallback: () => {
                    TheDice.unlockRoller();
                }
            },
            {
                id: 8,
                name: "The Switch",
                description: "Unlock The Switch",
                cost: 15,
                purchaseCallback: () => {
                    TheSwitch.unlock();
                }
            },
            {
                id: 9,
                name: "Music Pack 1",
                description: "Turn on the music",
                cost: 50,
                purchaseCallback: () => {
                    GameState.current.musicOn = true;
                    Achievements.unlockPack(AchievementPack.MUSIC);
                    EventHub.dispatch(GameEvent.MUSIC_ON);
                    Upgrade(10).unlock();
                }
            },
            {
                id: 10,
                name: "Regret Pack 1",
                description: "Turn off the music",
                cost: 5,
                purchaseCallback: () => {
                    GameState.current.musicOn = false;
                    EventHub.dispatch(GameEvent.MUSIC_OFF);
                }
            },
            {
                id: 11,
                name: "Achievement Point Generator",
                description: "Generates Achievement Points (duh!)",
                cost: 100,
                purchaseCallback: () => {
                    GameState.current.pointsGeneratorOn = true;
                    Achievements.unlockPack(AchievementPack.GENERATOR);
                    Upgrade(12).unlock();
                    EventHub.dispatch(GameEvent.GENERATOR_START);
                }
            },
            {
                id: 12,
                name: "Useless Upgrade",
                description: "You will regret that",
                cost: 1000000,
                purchaseCallback: () => {
                    Achievements.unlockPack(AchievementPack.REGRET);
                    EventHub.dispatch(GameEvent.REGRET);
                }
            }
        ]
    }
}