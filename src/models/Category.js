import Base from "./Base";

export default class Category extends Base{
    static table = "categories";
    constructor(){
        
        super("categories");
    }
}