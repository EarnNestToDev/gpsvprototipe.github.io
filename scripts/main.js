//#Main Script || Gracia Leaflet
//console.log("<< Cargando script... >>");

/* ***********************
***         Main       ***
*********************** */

// #Variables Globales
var database, HTMLTitle, HTMLBat, HTMLlat, HTMLLong, HTMLTime, HTMLRescConex, HTMLCharger; // no puede ser una constante porque se le aplica otro valor en la parte IniciarConexConFireBase();
var HTMLTop, HTMLTitlebox, HTMLLinea, HTMLDatatop, HTMLLatitudbox, HTMLLongitudbox, HTMLFechabox, HTMLMap, HTMLAcciones, HTMLBtninfo;
let map, MMarcador, MRadio, latActual, longActual;
let NBaseD = "GPS_DB", NTabla = "Prototipo", ModO = false;

HTMLTop = document.getElementById('top');
HTMLTitlebox = document.getElementById('titlebox');
HTMLLinea = document.getElementById('linea');
HTMLDatatop = document.getElementById('datatop');
HTMLLatitudbox = document.getElementById('latbox');
HTMLLongitudbox = document.getElementById('longbox');
HTMLFechabox = document.getElementById('timebox');
HTMLMap = document.getElementById('map');
HTMLAcciones = document.getElementById('acciones');
HTMLBtninfo = document.getElementById('btninfo');

HTMLTitle = document.getElementById('titlebox');
HTMLCharger = document.getElementById("charger");
HTMLBat = document.getElementById('batterybox');

// #Funciones
IniciarConexConFireBase();
CargarMapa();
ConsultarPosActualFireStore();


/* ***********************
***     Funciones      ***
*********************** */

// #Conectarse a Firebase
function IniciarConexConFireBase(){
    //console.log("<< Aplicando Conf. de Firebase >>");

    // Configuración a Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCBD8noCvkYndB2f7dJVjutQyKMezWhwbA",
        authDomain: "proyecto1-e6c3d.firebaseapp.com",
        databaseURL: "https://proyecto1-e6c3d-default-rtdb.firebaseio.com",
        projectId: "proyecto1-e6c3d",
        storageBucket: "proyecto1-e6c3d.appspot.com",
        messagingSenderId: "408864991734",
        appId: "1:408864991734:web:11415bd4f2f95561bcbfd7",
        measurementId: "G-CE0BJ2V69G"
    };
    
    // Inicializar conexión a Firebase
    //console.log("<< Iniciando Conexión a Firestore >>");
    firebase.initializeApp(firebaseConfig);
    database = firebase.firestore();

}//Fin


// #Iniciar Mapa
function CargarMapa(){

    // Coordenadas por defecto
    var lat = 33.513586783900024;
    var long = -41.01388531708284;

    // Iniciar Mapa
    //console.log("<< Iniciando Mapa >>");
    map = L.map('map',{minZoom: 2}).setView([lat, long], 2);
    
    // Agregar Capa del Mapa
    var urlmap = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    var capamap = L.tileLayer(urlmap, {
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    //console.log("<< Aplicando Capa >>");
    capamap.addTo(map);
    
    // Consultar disponibilidad de la geolocalización en el navegador
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta la función de geolocalización!");
    } else {
        setInterval(() => {
            //navigator.geolocation.getCurrentPosition(getPosicion);
        }, 5000);
    }

}//Fin 


// #Consultar la latitud y longitud desde FireStore y crear el marcador
function ConsultarPosActualFireStore(){
    //console.log("<< Obteniendo Lat y Long >>");
    //database.collection("GPS_DB").doc("Prototipo")
    database.collection(NBaseD).doc(NTabla)
        .onSnapshot((doc) => {
            //const datatoString = JSON.stringify(doc.data());
            //console.log("Current data: ", datatoString);
            // console.log(doc.get("Latitud"));
            HTMLlat = document.getElementById('latbox');
            HTMLLong = document.getElementById('longbox');
            HTMLTime = document.getElementById('timebox');
            // HTMLCharger = document.getElementById('chargerbox');
            // HTMLBat = document.getElementById('batterybox');

            HTMLRescConex = doc.get("Battery");
            HTMLlat.innerHTML = "<b>Latitud:</b>" + doc.get("Latitud");
            HTMLLong.innerHTML = "<b>Longitud:</b>" + doc.get("Longitud");
            HTMLTime.innerHTML = "<b>Última Actualización:</b><br>" + doc.get("UltiUpdate") + "</br>";
            // HTMLCharger.innerHTML = doc.get("Battery");
            
            VerificarConex(HTMLRescConex);//Meter en un update?
            SetBateria(doc.get("Battery"));
            SetModOscuro(doc.get("ModOscuro"));
            MarcadorPosActual(doc.get("Latitud"), doc.get("Longitud"));// ← Apartir de aquí ya no ejecuta
            // console.log("[ Aquí ]");
            
            latActual = doc.get("Latitud");
            longActual = doc.get("Longitud");
            ModO = doc.get("ModOscuro");//Aquí para que no le dé otro valor el si conexión
            
        });

}//Fin


// #Crear marcador en el mapa en la posición actual
function MarcadorPosActual(latMPA, longMPA){
    // Borrar marcador y radio sí existe
    if (MMarcador) {
        map.removeLayer(MMarcador);
    }

    if (MRadio) {
        map.removeLayer(MRadio);
    }

    // Crear marcador y radio en el mapa
    // console.log("<< Creando Marcador >>");
    
    //Aplicar Icono
    /* var MyIcon = L.icon({
        iconUrl: './img/marcador/mark.png',
        iconSize: [30, 30],
        popupAnchor: [-3, -76]
    }); */

    MMarcador = L.marker([latMPA, longMPA],{
        //draggable: true,
        title: 'Posición Actual',
        opacity: 0.8}).bindPopup('Posición Actual').openPopup();
        //opacity: 0.8}).bindPopup('Posición Actual').setIcon(MyIcon).openPopup();
    MRadio = L.circle([latMPA, longMPA], {
        //color: '#A0E9FD',
        fillColor: '#A0E9FD',
        radius: 200,
        fillOpacity: 0.4});
    var posaprox = L.featureGroup([MMarcador, MRadio]).addTo(map);

}//Fin


// #Centrar mapa en posición actual
function CentrarMapa() {
    if(latActual == undefined || longActual == undefined){
        alert("[ ! ] Por favor asegurese de tener una conexión estable a internet");
    }else{
        // Remueve el Radio para que no estorbe durante el zoom animado
        map.removeLayer(MRadio);

        if (latActual !== undefined && longActual !== undefined) {
            map.flyTo([latActual, longActual], 15);
            //console.log(latActual + " | " + longActual);
        } else {
            alert("No se han obtenido coordenadas de latitud y longitud.");
        }

        // Evita un bug gráfico al momento de hacer el zoom animado
        setTimeout(function(){
            MRadio = L.circle([latActual, longActual], {
                //color: '#A0E9FD',
                fillColor: '#A0E9FD',
                radius: 150,
                fillOpacity: 0.4});
            var posaprox = L.featureGroup([MMarcador, MRadio]).addTo(map);
        }, 3000);
    }
}//Fin


// #Cómo llegar
function LlegarA(){
    // Reemplaza 'mi+ubicacion' con tu posición actual si conoces las coordenadas
    var enlace = "https://www.google.com/maps/dir/?api=1&origin=mi+ubicacion&destination=" + latActual + "," + longActual;

    // Abre el enlace en una nueva ventana
    window.open(enlace, "_blank");
    
}//Fin


// #PopUp
function PopUpInfo(){
    // alert("Creo que haré un popup informativo... O un popup de configuración??");

}//Fin


// #Switch Oscuro
function SwitchModOscuro(){
    var usuarioRef = database.collection(NBaseD).doc(NTabla); // Obtener referencia al documento en Firestore

    if(ModO){
        //Cambiar a ligth
        usuarioRef.update({
            ModOscuro: false
        }).then(() => {
            // console.log('Datos actualizados exitosamente.');
        }).catch((error) => {
            // console.error('Error al actualizar los datos:', error);
        });
    }else{
        //Cambiar a dark
        usuarioRef.update({
            ModOscuro: true
        }).then(() => {
            // console.log('Datos actualizados exitosamente.');
        }).catch((error) => {
            // console.error('Error al actualizar los datos:', error);
        });
    }
    // Actualizar el campo 'Battery' en Firestore
}//Fin


// #VerificarConex
function VerificarConex(ramdomdata){
    if(ramdomdata != undefined){
        // alert("[ ! ] Por favor asegurese de tener una conexión estable a internet !!");
        HTMLTitle.innerHTML = "GPSVPrototipe";
    }else{
        HTMLTitle.innerHTML = "Sin conexión";
    }
    HTMLRescConex = undefined;
}


// #Set estado de la batería
function SetBateria(bat){
    // console.log("<< Estableciendo estado de la batería >>");
    // HTMLBat.innerHTML = bat + "%";
    if(bat <= 5 || bat == undefined){
        // HTMLBat.innerHTML = "Sin batería";
        DatosBatterybox(bat + "%", "dimgray", "'Sin batería'");
    }else if(bat >= 5 && bat <= 10){
        DatosBatterybox(bat + "%", "crimson", "'"+bat + "%'");

    }else if(bat >= 11 && bat <= 20){
        DatosBatterybox(bat + "%", "orangered", "'"+bat + "%'");

    }else if(bat >= 21 && bat <= 50){
        DatosBatterybox(bat + "%", "orange", "'"+bat + "%'");

    }else if(bat >= 51 && bat <= 80){
        DatosBatterybox(bat + "%", "gold", "'"+bat + "%'");
        
    }else if(bat >= 81 && bat <= 100){
        DatosBatterybox(bat + "%", "lawngreen", "'"+bat + "%'");
        
    }else{
        DatosBatterybox(0, "dimgray", "???");
        
    }

}//Fin


// #Ajuste
function DatosBatterybox(ancho, color, porciento){
    HTMLBat.style.setProperty('--nuevo-ancho-before', ancho);
    HTMLBat.style.setProperty('--batterybox-before-background-color', color);
    HTMLBat.style.setProperty('--batterybox-after-content', porciento);
}//Fin


// #Agregar animación al botón
document.getElementById('btnCentrar').addEventListener('click', function() {
    var btn = this;
    btn.classList.add('girar');

    // Después de 2 segundos, quitar la clase de animación
    setTimeout(function() {
        btn.classList.remove('girar');
    }, 2000); // Duración de la animación en milisegundos
});//Fin


// #Modo Oscuro
function SetModOscuro(MO){
    if(!MO){
        // Interfaz Ligth
        // console.log("<< Modo Ligth >>");
        // Top
        HTMLTop.style.setProperty('--top-background-color', "#0D4E59");
        HTMLBat.style.setProperty('--batterybox-background-color', "dimgray");
        HTMLTitlebox.style.setProperty('--titlebox-background-color', "#2C6F7A");
        
        // Linea
        HTMLLinea.style.setProperty('--linea-background-color', "#ADF0FC");
        HTMLDatatop.style.setProperty('--datatop-background-color', "#C6EFFC");
        HTMLLatitudbox.style.setProperty('--datatopvarios-background-color', "#A0E9FD");
        HTMLLatitudbox.style.setProperty('--datatopvarios-color', "#5F4F4C");
        HTMLLongitudbox.style.setProperty('--datatopvarios-background-color', "#A0E9FD");
        HTMLLongitudbox.style.setProperty('--datatopvarios-color', "#5F4F4C");
        HTMLTime.style.setProperty('--datatopvarios-background-color', "#A0E9FD");
        HTMLTime.style.setProperty('--datatopvarios-color', "#5F4F4C");
        // HTMLMap.style.setProperty('--map-background-color', "#C6EFFC");
        HTMLMap.style.border = "3px solid #C6EFFC";
        HTMLAcciones.style.setProperty('--acciones-background-color', "#C6EFFC");
        HTMLBtninfo.style.setProperty('--btninfo-background-color', "#0D4E59");
        document.body.style.backgroundColor = "white";

    }else{
        // Interfaz Dark
        // console.log("<< Modo Dark >>");
        // Top
        HTMLTop.style.setProperty('--top-background-color', "#031525");
        HTMLBat.style.setProperty('--batterybox-background-color', "#AFAFAF");
        HTMLTitlebox.style.setProperty('--titlebox-background-color', "#083862");
        
        // Linea
        HTMLLinea.style.setProperty('--linea-background-color', "#071A2B");
        HTMLDatatop.style.setProperty('--datatop-background-color', "#162C46");
        HTMLLatitudbox.style.setProperty('--datatopvarios-background-color', "#071A2B");
        HTMLLatitudbox.style.setProperty('--datatopvarios-color', "#C2D3FF");
        HTMLLongitudbox.style.setProperty('--datatopvarios-background-color', "#071A2B");
        HTMLLongitudbox.style.setProperty('--datatopvarios-color', "#C2D3FF");
        HTMLTime.style.setProperty('--datatopvarios-background-color', "#071A2B");
        HTMLTime.style.setProperty('--datatopvarios-color', "#C2D3FF");
        // HTMLMap.style.setProperty('--map-background-color', "#162C46");
        HTMLMap.style.border = "3px solid #162C46";
        HTMLAcciones.style.setProperty('--acciones-background-color', "#162C46");
        HTMLBtninfo.style.setProperty('--btninfo-background-color', "#031525");
        document.body.style.backgroundColor = "#191E29";
        
    }
}//Fin



// Fin