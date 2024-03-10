//#Main Script || Gracia Leaflet
//console.log("<< Cargando script... >>");

// #Variables Globales
var database; // no puede ser una constante porque se le aplica otro valor en la parte IniciarConexConFireBase();
let map, MMarcador, MRadio, latActual, longActual;
let NBaseD = "GPS_DB", NTabla = "Prototipo";

// #Funciones
IniciarConexConFireBase();
CargarMapa();
ConsultarPosActualFireStore();
//CentrarMapa();


//************************************************
//***||      Funciones   ||*********************
//********************************************

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
            //console.log(doc.get("Latitud"));
            var HTMLlat = document.getElementById('latbox');
            var HTMLLong = document.getElementById('longbox');
            var HTMLTime = document.getElementById('timebox');
            HTMLlat.innerHTML = "<b>Latitud:</b>" + doc.get("Latitud");
            HTMLLong.innerHTML = "<b>Longitud:</b>" + doc.get("Longitud");
            HTMLTime.innerHTML = "<b>Última Actualización:</b><br></br>" + doc.get("UltiUpdate");
            MarcadorPosActual(doc.get("Latitud"), doc.get("Longitud"));

            latActual = doc.get("Latitud");
            longActual = doc.get("Longitud");
            
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
    //console.log("<< Creando Marcador >>");
    
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
        radius: 150,
        fillOpacity: 0.4});
    var posaprox = L.featureGroup([MMarcador, MRadio]).addTo(map);

}//Fin


// #Centrar mapa en posición actual
function CentrarMapa() {
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
    }, 1000);

}//Fin


// #Cómo llegar
function LlegarA(){
    // Reemplaza 'mi+ubicacion' con tu posición actual si conoces las coordenadas
    var enlace = "https://www.google.com/maps/dir/?api=1&origin=mi+ubicacion&destination=" + latActual + "," + longActual;

    // Abre el enlace en una nueva ventana
    window.open(enlace, "_blank");

}//Fin


// Fin