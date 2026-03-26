export class Review {
    constructor(
        public id: string,
        public content: string,
        public status: string,
        public rating: number
    ) { }

    static make(id: string) {
        return new Review(id, "No content", "CREATED", 5);
    }

    toDTO() {
        return {
            id: this.id,
            content: this.content,
            status: this.status,
            rating: this.rating
        };
    }
}