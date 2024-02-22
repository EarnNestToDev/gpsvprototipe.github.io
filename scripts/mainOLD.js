//#Main Script || Gracia Leaflet
console.log("<< Cargando script... >>");





//map = L.map('map').setView([lat1, long1], 10);


console.log("<< Aplicando Conf. de Firebase >>");

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

// Initialize Firebase
console.log("<< Iniciando Conexión a Firestore >>");
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

/* var docRef = database.collection("GPS_DB").doc("Prototipo");
docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
}); */

console.log("<< Obteniendo Lat y Long >>");
database.collection("GPS_DB").doc("Prototipo")
    .onSnapshot((doc) => {
        //const datatoString = JSON.stringify(doc.data());
        //console.log("Current data: ", datatoString);
        //console.log(doc.get("Latitud"));
        var HTMLlat = document.getElementById('latbox');
        var HTMLLong = document.getElementById('longbox');
        HTMLlat.innerHTML = "Latitud: " + doc.get("Latitud");
        HTMLLong.innerHTML = "Longitud: " + doc.get("Longitud");
        CargarMapa(doc.get("Latitud"), doc.get("Longitud"));
    });




/* database.collection("GPS_DB").where("Prototipo", "==", true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); */


function ObtenerSnapS(){
    

}


function CargarMapa(lat1, long1){

    
    // Iniciar Mapa
    console.log("<< Iniciando Mapa >>");
    let map = L.map('map').setView([lat1, long1], 18);
    
    // Capa del Mapa
    var urlmap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var capamap = L.tileLayer(urlmap, {
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    console.log("<< Aplicando Capa >>");
    capamap.addTo(map);
    

    if (!navigator.geolocation) {
        console.log("Tu navegador no soporta la función de geolocalización!");
    } else {
        setInterval(() => {
            //navigator.geolocation.getCurrentPosition(getPosicion);
        }, 5000);
    

    console.log("<< Creando Marcador >>");
    //MMarcador = L.marker([lat1, long1]).bindPopup('Posición Actual\n('+ lat1 + ' | '+ long1 + ')').openPopup();
    MMarcador = L.marker([lat1, long1]).bindPopup('Posición Actual').openPopup();
    MRadio = L.circle([lat1, long1], {
        //color: '#A0E9FD',
        fillColor: '#A0E9FD',
        radius: 150,
        fillOpacity: 0.4});
    var posaprox = L.featureGroup([MMarcador, MRadio]).addTo(map);
    map.fitBounds(posaprox.getBounds());
    // map.setView([lat1, long1], 8);
    }
}//Fin 


//================
//Presición
//================
var marker, circle;




function getPosicion(position) {
    console.log("<< Adquiriendo Posición Actual >>");
    var lat = position.coords.latitude
    var long = position.coords.longitude
    var accuracy = position.coords.accuracy

    if (marker) {
        map.removeLayer(marker);
    }

    if (circle) {
        map.removeLayer(circle);
    }

    marker = L.marker([lat, long]);
    circle = L.circle([lat, long], { radius: accuracy });

    var featureGroup = L.featureGroup([marker, circle]).addTo(map);

    map.fitBounds(featureGroup.getBounds());

    console.log("Tus coords son: Lat: " + lat + " Long: " + long + "\nPresición: " + accuracy)
}


