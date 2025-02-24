import Base  from "./Base";

export default class User extends Base {
    static table = "users";
    constructor() {
        
        super("users");
    }
}