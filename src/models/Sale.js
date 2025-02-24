import Base from "./Base";

export default class Sale extends Base{
    static table = "sales";
    constructor() {
        
        super("sales");
    }
}