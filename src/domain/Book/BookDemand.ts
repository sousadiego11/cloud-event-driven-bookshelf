export namespace BookDemandDomain {
    export type BookId = string;
}

export class BookDemand {
    private static readonly DEMAND_THRESHOLD = 0.8;
    public static readonly ANALYSIS_PERIOD_DAYS = 30;

    readonly #loansInPeriod: number;
    readonly #copies: number;

    constructor(
        loansInPeriod: number,
        copies: number
    ) {
        this.#loansInPeriod = loansInPeriod;
        this.#copies = copies;
    }

    get ratio(): number {
        return this.#loansInPeriod / this.#copies;
    }

    isInHighDemand(): boolean {
        return this.ratio >= BookDemand.DEMAND_THRESHOLD;
    }
}