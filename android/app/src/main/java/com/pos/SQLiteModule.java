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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableNativeMap;

public class SQLiteModule extends ReactContextBaseJavaModule {

    private static final String DB_NAME = "AppDatabase.db";
    private static final int DB_VERSION = 1;
    private SQLiteDatabase database;

    public SQLiteModule(ReactApplicationContext reactContext) {
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
            // Initial setup can be empty; tables will be created dynamically
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            // Handle database upgrades dynamically
        }
    }

    @ReactMethod
    public void createTable(String tableName, String columns, Promise promise) {
        try {
            String query = "CREATE TABLE IF NOT EXISTS " + tableName + " (" + columns + ");";
            database.execSQL(query);
            promise.resolve("Table " + tableName + " created successfully");
        } catch (Exception e) {
            promise.reject("Create Table Error", e);
        }
    }


    @ReactMethod
    public void insertData(String tableName, String columns, String valuesPlaceholders, ReadableArray values, Promise promise) {
        try {
            Object[] valueArray = new Object[values.size()];
            for (int i = 0; i < values.size(); i++) {
                if (values.getType(i) == ReadableType.String) {
                    valueArray[i] = values.getString(i);
                } else if (values.getType(i) == ReadableType.Number) {
                    valueArray[i] = values.getDouble(i);
                } else if (values.getType(i) == ReadableType.Boolean) {
                    valueArray[i] = values.getBoolean(i) ? 1 : 0; // SQLite stores booleans as integers
                } else {
                    valueArray[i] = null;
                }
            }

            String query = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + valuesPlaceholders + ");";
            database.execSQL(query, valueArray);
            promise.resolve("Data inserted successfully into " + tableName);
        } catch (Exception e) {
            promise.reject("Insert Error", e);
        }
    }

    @ReactMethod
    public void insert(String query, ReadableArray values, Promise promise) {
        try {
            Object[] valueArray = new Object[values.size()];
            for (int i = 0; i < values.size(); i++) {
                if (values.getType(i) == ReadableType.String) {
                    valueArray[i] = values.getString(i);
                } else if (values.getType(i) == ReadableType.Number) {
                    valueArray[i] = values.getDouble(i);
                } else if (values.getType(i) == ReadableType.Boolean) {
                    valueArray[i] = values.getBoolean(i) ? 1 : 0; // SQLite stores booleans as integers
                } else {
                    valueArray[i] = null;
                }
            }

            //String query = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + valuesPlaceholders + ");";
            database.execSQL(query, valueArray);
            promise.resolve("Data inserted successfully" );
        } catch (Exception e) {
            promise.reject("Insert Error", e);
        }
    }

    @ReactMethod
    public void controlData(String query, ReadableArray values, Promise promise) {
        try {
            Object[] valueArray = new Object[values.size()];
            for (int i = 0; i < values.size(); i++) {
                if (values.getType(i) == ReadableType.String) {
                    valueArray[i] = values.getString(i);
                } else if (values.getType(i) == ReadableType.Number) {
                    valueArray[i] = values.getDouble(i);
                } else if (values.getType(i) == ReadableType.Boolean) {
                    valueArray[i] = values.getBoolean(i) ? 1 : 0; // SQLite stores booleans as integers
                } else {
                    valueArray[i] = null;
                }
            }

            //String query = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + valuesPlaceholders + ");";
            database.execSQL(query, valueArray);
            promise.resolve("Successfully executed" );
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @ReactMethod
    public void getData(String query,ReadableArray values, Promise promise) {
        try {
            String[] valueArray = new String[values.size()];
            for (int i = 0; i < values.size(); i++) {
                if (values.getType(i) == ReadableType.String) {
                    valueArray[i] = values.getString(i);
                } else if (values.getType(i) == ReadableType.Number) {
                    valueArray[i] = String.valueOf(values.getDouble(i));
                } else if (values.getType(i) == ReadableType.Boolean) {
                    valueArray[i] = values.getBoolean(i) ? "1" : "0"; // SQLite stores booleans as integers
                } else {
                    valueArray[i] = null;
                }
            }

            Cursor cursor = database.rawQuery(query, valueArray);

            WritableNativeArray dataArray = new WritableNativeArray();

            if (cursor.moveToFirst()) {
                do {
                    WritableNativeMap dataMap = new WritableNativeMap();
                    for (int i = 0; i < cursor.getColumnCount(); i++) {
                        String columnName = cursor.getColumnName(i);
                        int type = cursor.getType(i);
                        switch (type) {
                            case Cursor.FIELD_TYPE_INTEGER:
                                dataMap.putInt(columnName, cursor.getInt(i));
                                break;
                            case Cursor.FIELD_TYPE_FLOAT:
                                dataMap.putDouble(columnName, cursor.getDouble(i));
                                break;
                            case Cursor.FIELD_TYPE_STRING:
                                dataMap.putString(columnName, cursor.getString(i));
                                break;
                            case Cursor.FIELD_TYPE_BLOB:
                                dataMap.putString(columnName, new String(cursor.getBlob(i)));
                                break;
                            case Cursor.FIELD_TYPE_NULL:
                                dataMap.putNull(columnName);
                                break;
                        }
                    }
                    dataArray.pushMap(dataMap);
                } while (cursor.moveToNext());
            }
            cursor.close();
            promise.resolve(dataArray);
        } catch (Exception e) {
            promise.reject("Fetch Error", e);
        }
    }




    @ReactMethod
    public void fetchData(String tableName, Promise promise) {
        try {
            Cursor cursor = database.rawQuery("SELECT * FROM " + tableName + ";", null);
            WritableNativeArray dataArray = new WritableNativeArray();

            if (cursor.moveToFirst()) {
                do {
                    WritableNativeMap dataMap = new WritableNativeMap();
                    for (int i = 0; i < cursor.getColumnCount(); i++) {
                        String columnName = cursor.getColumnName(i);
                        int type = cursor.getType(i);
                        switch (type) {
                            case Cursor.FIELD_TYPE_INTEGER:
                                dataMap.putInt(columnName, cursor.getInt(i));
                                break;
                            case Cursor.FIELD_TYPE_FLOAT:
                                dataMap.putDouble(columnName, cursor.getDouble(i));
                                break;
                            case Cursor.FIELD_TYPE_STRING:
                                dataMap.putString(columnName, cursor.getString(i));
                                break;
                            case Cursor.FIELD_TYPE_BLOB:
                                dataMap.putString(columnName, new String(cursor.getBlob(i)));
                                break;
                            case Cursor.FIELD_TYPE_NULL:
                                dataMap.putNull(columnName);
                                break;
                        }
                    }
                    dataArray.pushMap(dataMap);
                } while (cursor.moveToNext());
            }
            cursor.close();
            promise.resolve(dataArray);
        } catch (Exception e) {
            promise.reject("Fetch Error", e);
        }
    }

    @ReactMethod
    public void deleteData(String tableName, String condition, String[] args, Promise promise) {
        try {
            String query = "DELETE FROM " + tableName + " WHERE " + condition + ";";
            database.execSQL(query, args);
            promise.resolve("Data deleted successfully from " + tableName);
        } catch (Exception e) {
            promise.reject("Delete Error", e);
        }
    }

    @ReactMethod
    public void executeQuery(String query, String[] args, Promise promise) {
        try {
            Cursor cursor = database.rawQuery(query, args);
            WritableNativeArray resultArray = new WritableNativeArray();

            if (cursor.moveToFirst()) {
                do {
                    WritableNativeMap rowMap = new WritableNativeMap();
                    for (int i = 0; i < cursor.getColumnCount(); i++) {
                        String columnName = cursor.getColumnName(i);
                        int type = cursor.getType(i);
                        switch (type) {
                            case Cursor.FIELD_TYPE_INTEGER:
                                rowMap.putInt(columnName, cursor.getInt(i));
                                break;
                            case Cursor.FIELD_TYPE_FLOAT:
                                rowMap.putDouble(columnName, cursor.getDouble(i));
                                break;
                            case Cursor.FIELD_TYPE_STRING:
                                rowMap.putString(columnName, cursor.getString(i));
                                break;
                            case Cursor.FIELD_TYPE_BLOB:
                                rowMap.putString(columnName, new String(cursor.getBlob(i)));
                                break;
                            case Cursor.FIELD_TYPE_NULL:
                                rowMap.putNull(columnName);
                                break;
                        }
                    }
                    resultArray.pushMap(rowMap);
                } while (cursor.moveToNext());
            }
            cursor.close();
            promise.resolve(resultArray);
        } catch (Exception e) {
            promise.reject("Query Execution Error", e);
        }
    }
}