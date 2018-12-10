interface RollADieCallback {
    (throwValues: number[]): void;
}

declare function rollADie(options: {
    element: HTMLElement,
    numberOfDice: number,
    callback: RollADieCallback,
    noSound?: boolean,
    delay?: number,
    values?: number[]
}): void;