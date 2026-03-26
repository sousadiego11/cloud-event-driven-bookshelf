export class Order {
    constructor(
        public id: string,
        public amount: number,
        public status: string,
        public canceled: boolean
    ) { }

    static make(id: string, amount: number) {
        return new Order(id, amount, "CREATED", false);
    }

    toDTO() {
        return {
            id: this.id,
            amount: this.amount,
            status: this.status,
            canceled: this.canceled
        };
    }

    cancel() {
        this.canceled = true
    }
}