import {AchievementPack} from "../achievement-pack";

export interface AchievementDataRecord {
    id: number;
    pack: AchievementPack;
    name: string;
    hint?: string;
    hintVisible?: boolean,
    goal?: number;
    points: number;
    events?: { [event: string] : Function };
    subscribe?: Function;
    unsubscribe?: Function;
}