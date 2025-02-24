package com.pos;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.widget.ImageView;
import android.widget.TextView;


public class SplashScreenActivity extends AppCompatActivity {


    private ImageView imageView;
    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            Thread.sleep(5000);
            Intent intent = new Intent();
            intent.setClass(this,MainActivity.class);
            startActivity(intent);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }


}