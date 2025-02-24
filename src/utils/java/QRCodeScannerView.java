

import android.content.Context;
import android.graphics.ImageFormat;
import android.media.Image;
import android.util.Base64;
import android.util.Log;
import android.view.TextureView;

import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.lifecycle.LifecycleOwner;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.common.util.concurrent.ListenableFuture;

import java.nio.ByteBuffer;

public class QRCodeScannerView extends SimpleViewManager<TextureView> {

    private final ReactApplicationContext reactContext;

    public QRCodeScannerView(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "QRCodeScannerView";
    }

    @Override
    protected TextureView createViewInstance(ThemedReactContext reactContext) {
        TextureView textureView = new TextureView(reactContext);
        startCamera(textureView);
        return textureView;
    }

    private void startCamera(TextureView textureView) {
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture =
                ProcessCameraProvider.getInstance(reactContext);

        cameraProviderFuture.addListener(() -> {
            ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
            ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build();

            imageAnalysis.setAnalyzer(executor, image -> {
                Image mediaImage = image.getImage();
                if (mediaImage != null && mediaImage.getFormat() == ImageFormat.YUV_420_888) {
                    ByteBuffer buffer = mediaImage.getPlanes()[0].getBuffer();
                    byte[] bytes = new byte[buffer.remaining()];
                    buffer.get(bytes);
                    String base64Image = Base64.encodeToString(bytes, Base64.DEFAULT);
                    Log.d("QRCodeScanner", "Image data: " + base64Image);
                    // Implement decoding manually
                }
                image.close();
            });

            cameraProvider.bindToLifecycle((LifecycleOwner) reactContext.getCurrentActivity(), imageAnalysis);
        }, ContextCompat.getMainExecutor(reactContext));
    }
}
