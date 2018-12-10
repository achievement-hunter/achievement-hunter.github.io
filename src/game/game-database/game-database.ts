import AchievementData from "./achievement-data";
import UpgradeData from "./upgrade-data";
import {AchievementDataRecord} from "./achievement-data-record";

export class GameDatabase {
    static achievements = AchievementData.create();
    static upgrades = UpgradeData.create();
}

export const achievementDataMap : AchievementDataRecord[] = [];
for (let ach of GameDatabase.achievements) {
    achievementDataMap[ach.id] = ach;
}

export function findGameDataById<T>(data: T[], id: number): T {
    let record = data[id];
    if (record === undefined) {
        throw "Data record not found!";
    }
    return record;
}