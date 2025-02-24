package com.pos;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableType;

public class NotificationModule extends ReactContextBaseJavaModule {

    private static String CHANNEL_NAME = "channel_name";
    private static String CHANNEL_ID = "channel_id";

    public NotificationModule(ReactApplicationContext ReactContext) {
        super(ReactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void sendNotification(String title, String message, Promise promise) {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = CHANNEL_NAME;
            String description = "Notification";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManagerSystem
                    = (NotificationManager) getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(), CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_notification_overlay)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
//        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return;
//        }
        notificationManager.notify(0, builder.build());

        promise.resolve("Notification sent");
    }

    @ReactMethod
    public void scheduleNotification(String title,String message, Promise promise){
        promise.resolve("Notification scheduled");
    }
    
}