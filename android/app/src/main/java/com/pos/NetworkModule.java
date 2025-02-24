package com.pos;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NetworkModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public NetworkModule(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
        reactContext = reactApplicationContext;
        registerNetworkReceiver();
    }

    @NonNull
    @Override
    public String getName(){
        return "NetworkModule";
    }

    @ReactMethod
    public void isInternetAvailable(Promise promise){
        promise.resolve(checkInternet());
    }

    private boolean checkInternet(){
        ConnectivityManager connectivityManager =
                (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
//        if(connectivityManager != null){
//            if(Build.VERSION.SDK_INT < 23){
//                NetworkInfo networkInfo = connectivityManager.getActiveNetwork();
//                if(networkInfo != null){
//
//                }
//            }else{
//
//
//
//            }
//
//        }

        if(connectivityManager != null){
            NetworkCapabilities networkCapabilities = connectivityManager.getNetworkCapabilities(connectivityManager.getActiveNetwork());
//            if(networkInfo != null){
//                if(networkInfo.isConnected()){
//                    return true;
//                } else if (networkInfo.isAvailable()) {
//                    return true;
//                } else if (networkInfo.isFailover()) {
//                    return false;
//                }
//            }
            if(networkCapabilities!=null){
                return networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                        networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR);
            }else{
                return false;
            }
        }
        return false;
    }


    private void registerNetworkReceiver(){
        IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        reactContext.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                boolean isConnected = checkInternet();
                // Send event
                sendEvent("networkStatus",isConnected);
            }
        },filter);
    }

    private void sendEvent(String eventName,boolean isConnected){
        if(reactContext.hasCatalystInstance()){
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName,isConnected);
        }
    }
}
