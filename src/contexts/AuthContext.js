import { createContext } from "react";

export const AuthContext = createContext({logged_in:false,user:{}});