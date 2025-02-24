

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.provider.OpenableColumns;
import android.database.Cursor;
import android.content.Context;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class FileHandlerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int FILE_PICKER_REQUEST = 1;
    private Promise filePickerPromise;
    private final ReactApplicationContext reactContext;

    public FileHandlerModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        context.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "FileHandlerModule";
    }

    @ReactMethod
    public void pickFile(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("Error", "Activity not found.");
            return;
        }

        filePickerPromise = promise;

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.setType("*/*"); // Allow all file types
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        activity.startActivityForResult(intent, FILE_PICKER_REQUEST);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_PICKER_REQUEST && filePickerPromise != null) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                Uri uri = data.getData();
                if (uri != null) {
                    String filePath = getRealPathFromURI(uri);
                    filePickerPromise.resolve(filePath);
                } else {
                    filePickerPromise.reject("Error", "File URI is null.");
                }
            } else {
                filePickerPromise.reject("Error", "File selection cancelled.");
            }
            filePickerPromise = null;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {}

    private String getRealPathFromURI(Uri uri) {
        return uri.toString(); // Return full URI for images
    }

    @ReactMethod
    public void saveFile(String originalFilePath, Promise promise) {
        try {
            File originalFile = new File(originalFilePath);
            if (!originalFile.exists()) {
                promise.reject("Error", "Original file not found.");
                return;
            }

            File storageDir = reactContext.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
            if (storageDir == null) {
                promise.reject("Error", "Storage directory not available.");
                return;
            }

            File newFile = new File(storageDir, "saved_" + originalFile.getName());
            InputStream inputStream = new FileInputStream(originalFile);
            OutputStream outputStream = new FileOutputStream(newFile);

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            inputStream.close();
            outputStream.close();

            promise.resolve(newFile.getAbsolutePath());
        } catch (Exception e) {
            promise.reject("Error", e.getMessage());
        }
    }

    @ReactMethod
    public void readFile(String filePath, Promise promise) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                promise.reject("Error", "File not found");
                return;
            }

            // Check if it's an image
            String extension = getFileExtension(file);
            if (extension.matches("(?i)(jpg|jpeg|png|gif|bmp|webp)")) {
                promise.resolve("file://" + file.getAbsolutePath()); // Return URI for image
                return;
            }

            // Read text file
            FileInputStream fis = new FileInputStream(file);
            byte[] buffer = new byte[(int) file.length()];
            fis.read(buffer);
            fis.close();

            String fileContent = new String(buffer, StandardCharsets.UTF_8);
            promise.resolve(fileContent);
        } catch (Exception e) {
            promise.reject("Error", e.getMessage());
        }
    }

    private String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        return (lastIndexOf == -1) ? "" : name.substring(lastIndexOf + 1);
    }
}
