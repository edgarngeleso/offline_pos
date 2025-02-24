import { createContext } from "react";

export const SettingsContext = createContext({
    dark_theme:false,
    system_theme:true,
    auto_save:false,
    show_notifications:false,
    auto_suggest:false,
    ads:true,
});