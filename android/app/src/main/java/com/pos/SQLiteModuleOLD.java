
// SQLiteModule.java
package com.pos;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

public class SQLiteModuleOLD extends ReactContextBaseJavaModule {

    private static final String DB_NAME = "AppDatabase.db";
    private static final int DB_VERSION = 1;
    private SQLiteDatabase database;

    public SQLiteModuleOLD(ReactApplicationContext reactContext) {
        super(reactContext);
        DatabaseHelper dbHelper = new DatabaseHelper(reactContext);
        database = dbHelper.getWritableDatabase();
    }

    @Override
    public String getName() {
        return "SQLiteModule";
    }

    private static class DatabaseHelper extends SQLiteOpenHelper {

        DatabaseHelper(Context context) {
            super(context, DB_NAME, null, DB_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);");
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            db.execSQL("DROP TABLE IF EXISTS Users;");
            onCreate(db);
        }
    }

    @ReactMethod
    public void createTable(String query,  Promise promise) {
        try {
            database.execSQL(query);
            promise.resolve("Table created successfully");
        } catch (Exception e) {
            promise.reject("Table creation Error", e);
        }
    }

    @ReactMethod
    public void insertUser(String name, int age, Promise promise) {
        try {
            database.execSQL("INSERT INTO Users (name, age) VALUES (?, ?);", new Object[]{name, age});
            promise.resolve("User added successfully");
        } catch (Exception e) {
            promise.reject("Insert Error", e);
        }
    }

    @ReactMethod
    public void getUsers(Promise promise) {
        try {
            Cursor cursor = database.rawQuery("SELECT * FROM Users;", null);
            WritableNativeArray usersArray = new WritableNativeArray();

            if (cursor.moveToFirst()) {
                do {
                    WritableNativeMap userMap = new WritableNativeMap();
                    userMap.putInt("id", cursor.getInt(0));
                    userMap.putString("name", cursor.getString(1));
                    userMap.putInt("age", cursor.getInt(2));
                    usersArray.pushMap(userMap);
                } while (cursor.moveToNext());
            }
            cursor.close();
            promise.resolve(usersArray);
        } catch (Exception e) {
            promise.reject("Query Error", e);
        }
    }

    @ReactMethod
    public void deleteUser(int id, Promise promise) {
        try {
            database.execSQL("DELETE FROM Users WHERE id = ?;", new Object[]{id});
            promise.resolve("User deleted successfully");
        } catch (Exception e) {
            promise.reject("Delete Error", e);
        }
    }
}


