import Base from "./Base";

export default class Company extends Base{
    static table = "companies";
    constructor(){
        super("companies");
    }
}