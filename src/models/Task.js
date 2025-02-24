import Base from "./Base";

export default class Task extends Base{
    static table = "tasks";
    constructor(){
        super("tasks");
    }
}