package com.contenido.gpssenderprototipe;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
public class LocalizadorTask extends Worker {

    private long timeMills;
    static private int counter = 0;
    private Handler handler;
    private Context context;
    static public boolean isStopped;

    public LocalizadorTask(@NonNull Context context,
                          @NonNull WorkerParameters workerParameters){
        super(context, workerParameters);
        this.context = context;
        handler = new Handler(Looper.getMainLooper());
        setProgressAsync(new Data.Builder().
                putString("PROGRESS", "Time: " + 0L + "_" + "Counter: "+ 0).build());
        isStopped = false;
    }

    @NonNull
    @Override
    public Result doWork(){
        timeMills = System.currentTimeMillis();
        counter++;

        setProgressAsync(new Data.Builder().putString("PROGRESS",
                "Time: " + timeMills + "_" + "Counter: " + counter).build());

        handler.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(context, "Time: " + timeMills + "_and_" + "Counter: " + counter,
                        Toast.LENGTH_SHORT).show();
            }
        });
        return Result.success();
    }

}
