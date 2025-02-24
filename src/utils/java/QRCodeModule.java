package com.yourapp;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class QRCodeModule extends ReactContextBaseJavaModule {

    public QRCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "QRCodeModule";
    }

    // Generate a QR Code as Bitmap
    private Bitmap generateQRCodeBitmap(String data, int size) {
        Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();
        paint.setColor(Color.BLACK);
        canvas.drawColor(Color.WHITE);

        int squareSize = size / data.length();
        for (int y = 0; y < data.length(); y++) {
            for (int x = 0; x < data.length(); x++) {
                if (data.charAt((y * data.length()) + x) % 2 == 0) {
                    canvas.drawRect(x * squareSize, y * squareSize, (x + 1) * squareSize, (y + 1) * squareSize, paint);
                }
            }
        }
        return bitmap;
    }

    // Save QR Code as Image
    @ReactMethod
    public void saveQRCodeAsImage(String data, Promise promise) {
        try {
            Bitmap qrBitmap = generateQRCodeBitmap(data, 500);
            File path = new File(Environment.getExternalStorageDirectory(), "QRCode.png");
            FileOutputStream outputStream = new FileOutputStream(path);
            qrBitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            outputStream.flush();
            outputStream.close();
            promise.resolve("Saved at: " + path.getAbsolutePath());
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    // Save QR Code as PDF
    @ReactMethod
    public void saveQRCodeAsPDF(String data, Promise promise) {
        try {
            Bitmap qrBitmap = generateQRCodeBitmap(data, 500);
            PdfDocument pdfDocument = new PdfDocument();
            PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(500, 500, 1).create();
            PdfDocument.Page page = pdfDocument.startPage(pageInfo);
            Canvas canvas = page.getCanvas();
            canvas.drawBitmap(qrBitmap, 0, 0, null);
            pdfDocument.finishPage(page);

            File path = new File(Environment.getExternalStorageDirectory(), "QRCode.pdf");
            FileOutputStream outputStream = new FileOutputStream(path);
            pdfDocument.writeTo(outputStream);
            pdfDocument.close();
            outputStream.flush();
            outputStream.close();
            promise.resolve("Saved at: " + path.getAbsolutePath());
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}

