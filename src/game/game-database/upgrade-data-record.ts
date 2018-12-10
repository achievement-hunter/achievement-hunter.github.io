export interface UpgradeDataRecord {
    id: number;
    name: string;
    description: string;
    cost: number;
    purchaseCallback: Function;
}