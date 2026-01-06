package com.contenido.gpssenderprototipe;

import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;

import android.os.BatteryManager;
import android.content.Intent;
import android.widget.Toast; //para mostrar un mensaje

import androidx.appcompat.app.AppCompatActivity;

public class PopUpAjustes extends AppCompatActivity {
    static String TPUA = "5";
    private Button btnSalir, btnGuardar;
    Spinner comboBoxFU;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        setContentView(R.layout.popup_ajustes);

        comboBoxFU = findViewById(R.id.cbFUpdate);
        btnGuardar = findViewById(R.id.btnGuardar);
        btnSalir = findViewById(R.id.btnSalir);


        DisplayMetrics medidas = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(medidas);

        int ancho, largo;
        ancho = medidas.widthPixels;
        largo = medidas.heightPixels;

        getWindow().setLayout((int)(ancho * 0.85), (int)(largo * 0.75));

        // [ Empieza el desmadre ]

        //Settear valores del array al combo box
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.FUTiempo, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_item);
        comboBoxFU.setAdapter(adapter);
        btnSalir.setText("<");



        // Settear Función al Botón
        btnGuardar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String spinnerText = comboBoxFU.getSelectedItem().toString();
                MainActivity.timerFU = spinnerText;
            }
        });


        btnSalir.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fin();
            }
        });

    }

    //No jaló
    public int cargaBateria(){
        try
        {
            IntentFilter batIntentFilter =
                    new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent battery =
                    this.registerReceiver(null, batIntentFilter);
            int nivelBateria = battery.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            return nivelBateria;
        }
        catch (Exception e)
        {
            Toast.makeText(getApplicationContext(),
                    "Error al obtener estado de la batería",
                    Toast.LENGTH_SHORT).show();
            return 0;
        }
    }

    private void fin(){
        this.finish();
    }
}
