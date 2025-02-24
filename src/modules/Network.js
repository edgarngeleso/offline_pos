import { NativeModules,NativeEventEmitter } from "react-native";

const {NetworkModule} = NativeModules;
const eventEmitter = new NativeEventEmitter;

export const checkInternet = async()=>{
    let response = await NetworkModule.isInternetAvailable();
    return response;
}

export const networkStatus = (callback)=>{
let response = eventEmitter.addListener("networkStatus",callback);
return response;
}
