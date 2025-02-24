package com.pos;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.os.Environment;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileHandlerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    public FileHandlerModule(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
        this.reactContext = reactApplicationContext;
    }

    @NonNull
    @Override
    public String getName(){
        return "FileHandler";
    }

    public File getFile(String folderName, String fileName){
        File documentDirectory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);
        if(!documentDirectory.exists()){
            documentDirectory.mkdirs();
        }
        File customFolder = new File(documentDirectory,folderName);
        if(!customFolder.exists()){
            customFolder.mkdirs();
        }
        return new File(customFolder,fileName);
    }
    @ReactMethod
    public void readFile(String fileName, Promise promise){
        File file = getFile("offline_pos",fileName);
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            int size = fileInputStream.available();
            byte[] bytes = new byte[size];
            fileInputStream.read(bytes);
            fileInputStream.close();

            String content = new String(bytes);
            promise.resolve(content);

        } catch (IOException e) {
            promise.reject(e);
            throw new RuntimeException(e);
        }
    }

    @ReactMethod
    public  void  writeToFile(String fileName,String content,Promise promise){
        File file = getFile("offline_pos",fileName);
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(content.getBytes());
            fileOutputStream.close();
            promise.resolve("Successfully added");
        } catch (IOException e) {
            promise.reject(e);
            throw new RuntimeException(e);
        }

    }

    @ReactMethod
    public void createPDF(String fileName, String title,String body,String footer, Promise promise){
        PdfDocument pdfDocument = new PdfDocument();
        Paint paint = new Paint();

        PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(300,600,1).create();
        PdfDocument.Page page = pdfDocument.startPage(pageInfo);
        Canvas canvas = page.getCanvas();

        int y = 40;

        //Heading/title
        paint.setTextSize(20);
        paint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText(title, (float) pageInfo.getPageWidth() /2,y,paint);

        y+= 50;
        // body

        paint.setTextSize(14);
        paint.setTextAlign(Paint.Align.LEFT);
        canvas.drawText(body,20,y,paint);

        y+= 100;

        //footer

        paint.setTextSize(20);
        paint.setTextAlign(Paint.Align.LEFT);
        paint.setFakeBoldText(true);
        canvas.drawText(footer,20,y,paint);

        pdfDocument.finishPage(page);

        File file = getFile("offline_pos",fileName);
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(file);
            pdfDocument.writeTo(fileOutputStream);
            pdfDocument.close();
            fileOutputStream.close();
            promise.resolve("Successfully added");
        } catch (IOException e) {
            promise.reject(e);
            throw new RuntimeException(e);
        }


    }

    @ReactMethod
    public void printPDF(String fileName){

    }
}
