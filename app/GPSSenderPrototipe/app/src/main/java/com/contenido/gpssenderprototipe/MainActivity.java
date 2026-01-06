package com.contenido.gpssenderprototipe;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.BatteryManager;
import android.os.Bundle;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.firestore.FirebaseFirestore;
import androidx.annotation.NonNull;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.SetOptions;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


public class MainActivity extends AppCompatActivity {

    //****************************
    //        Variables
    //****************************
    private Context context;
    private FusedLocationProviderClient fusedLocationProviderClient;
    private FirebaseFirestore db;
    private String NDataBase, NTable;
    TextView locationTextView, txtdebugger;
    Button btnGPS, btnConfig;
    LocationRequest locationRequest;
    int conter = 0;
    public static String timerFU = "5";

    //****************************
    //          Main
    //****************************

    // #onCreate
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NDataBase = "GPS_DB";
        NTable = "Prototipo";
        locationTextView = findViewById(R.id.locationTextView);
        txtdebugger = findViewById(R.id.txtDebugger);
        btnGPS = findViewById(R.id.getLocationButton);
        btnConfig = findViewById(R.id.btnConfig);
        locationTextView.setText("...");
        btnGPS.setText("Iniciar Localización");
        txtdebugger.setText("Debugger...");
        db = FirebaseFirestore.getInstance();

        //btnConfig.setEnabled(false);

        // Settear Función al Botón
        btnGPS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                /*
                if (!LocalizacionEncendido){
                    btnGPS.setText("Encendido");
                    IniciarLocalizacion();
                    LocalizacionEncendido = true;
                }else{
                    btnGPS.setText("Pausado");
                    LocalizacionEncendido = false;
                }*/
                IniciarLocalizacion();
                btnGPS.setText("Encendido");
                btnGPS.setEnabled(false);
                btnGPS.setBackgroundColor(getResources().getColor(R.color.azuloff));

                //Toast.makeText(this, "Hola", Toast.LENGTH_SHORT).show();
                //Toast.makeText(context, "Localizador Encendido!", Toast.LENGTH_SHORT).show();
            }
        });

        btnConfig.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                txtdebugger.setText("Botón deshabilitado!");
                //Toast.makeText(context, "Botón deshabilitado!", Toast.LENGTH_SHORT).show();
                //startActivity(new Intent(MainActivity.this, PopUpAjustes.class));
            }
        });

    }// Fin onCreate();


    //****************************
    //        Funciones
    //****************************

    // #Iniciar Localización
    public void IniciarLocalizacion() {
            locationTextView.setText("Obteniendo Coordenadas...");
            fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
            // Pedir permisos
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                    && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
                ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, 2);
            }

            // Instancear locationrequest
            locationRequest = locationRequest.create();
            locationRequest.setInterval(Integer.parseInt(timerFU) * 1000); //Segundos
            locationRequest.setFastestInterval(Integer.parseInt(timerFU) * 1000);
            locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

            // Instancear locationcallback
            LocationCallback locationCallback = new LocationCallback() {
                @Override
                public void onLocationResult(LocationResult locationResult) {
                    if (locationResult != null) {
                        if (locationResult == null) {
                            return;
                        }
                        // Mostrar Latitud y Longitud
                        for (Location location : locationResult.getLocations()) {
                            locationTextView.setText("Lat: " + location.getLatitude() + "\nLong: " + location.getLongitude() + "\nPresición: " + location.getAccuracy()
                                    + "\nActualización: " + timerFU + " secs\n" + "Bat: " + EstadoBateria());

                            Map<String, Object> valores = new HashMap<>();
                            valores.put("Latitud", location.getLatitude());
                            valores.put("Longitud", location.getLongitude());
                            valores.put("UltiUpdate", TimeActual());
                            valores.put("Battery", EstadoBateria());

                            EnviarAFB(valores);
                        }
                        conter++;

                    }
                }
            };
            fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());

    }// Fin IniciarLocalizacion();


    // #Enviar Coords a Firebase
    public void EnviarAFB(Object o){
        db.collection(NDataBase).document(NTable)
                .set(o, SetOptions.merge())
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        //Log.d(TAG, "DocumentSnapshot successfully written!");
                        txtdebugger.setText("Enviado a '" + NTable + "' (" + conter + ")");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        //Log.w(TAG, "Error writing document", e);
                        txtdebugger.setText("Error: " + e);
                    }
                });
    }// Fin EnviarAFB();


    // #Obtener hora y fecha actual del dispositivo
    public String TimeActual(){
        // Obtener la hora y fecha actuales
        Date ahora = new Date();

        // Formatear la fecha y hora en un string
        SimpleDateFormat formatoFecha = new SimpleDateFormat("'['dd-MM-yyyy'] ' HH:mm:ss", Locale.getDefault());
        String fechaHoraString = formatoFecha.format(ahora);

        return fechaHoraString;
    }// Fin TimeActual();


    // #Consultar estado de la batería
    public int EstadoBateria(){
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = registerReceiver(null, ifilter);

        float level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        float scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        float battery = (level / (float)scale)*100;
        int batInt = (int)battery;
        return batInt;
    }// Fin EstadoBateria();

}// Fin