package com.pos;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class QrCodeScannerModule extends ReactContextBaseJavaModule {
    public QrCodeScannerModule(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
    }
    @NonNull
    @Override
    public String getName(){
        return "QrCodeScanner";
    }

    @ReactMethod
    public void scanWithCamera(Promise promise){

    }

    @ReactMethod
    public void scanImage(Promise promise){

    }
}
