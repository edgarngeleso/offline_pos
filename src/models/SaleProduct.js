import Base from "./Base";

export default class SaleProduct extends Base{
    static table = "sale_products";
    constructor() {
        
        super("sale_products");
    }
}