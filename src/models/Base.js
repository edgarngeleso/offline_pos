import { NativeModules } from "react-native";

const {SQLiteModule} = NativeModules;

export default class Base {
    static table = "";
    constructor(table) {
        this.table = table;
    }

    static async selectAll(query,values=[]){
        
        if(!query){
            query = `SELECT * FROM ${this.table} ORDER BY id DESC`;
        }
        
        
        try {
            let response = await SQLiteModule.getData(query,values);
            return {error:false,message:"success",data:response}
        } catch (e) {
            return {error:true,message:e}
        }
    }

    static async selectOne(){
        
        let  query = `SELECT * FROM ${this.table} ORDER BY id DESC LIMIT 1`;
        
        try {
            let response = await SQLiteModule.getData(query,[]);
            return {error:false,message:"success",data:Array.isArray(response)?response[0]:response}
        } catch (e) {
            return {error:true,message:e}
        }
    }

    static async insert(query,values){
        try {
            let response = await SQLiteModule.controlData(query,values);
            return {error:false,message:"success",data:response}
        } catch (e) {
            return {error:true,message:e}
        }
    }

    static async update(query,values){
        try {
            let response = await SQLiteModule.controlData(query,values);
            return {error:false,message:"success",data:response}
        } catch (e) {
            return {error:true,message:e}
        }
    }

    static async remove(query,values){
        try {
            let response = await SQLiteModule.controlData(query,values);
            return {error:false,message:"success",data:response}
        } catch (e) {
            return {error:true,message:e}
        }
    }

}