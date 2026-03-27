type ProductIdInventory = string;

export class Inventory {
    productId: ProductIdInventory;
    availableQuantity: number;

    constructor(productId: ProductIdInventory, availableQuantity: number) {
        this.productId = productId;
        this.availableQuantity = availableQuantity;
    }

    toDto() {
        return {
            productId: this.productId,
            availableQuantity: this.availableQuantity,
        };
    }
}
