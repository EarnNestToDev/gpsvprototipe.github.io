plugins {
    id("com.android.application")

    //#GPS
    id ("com.google.gms.google-services")
}

android {
    namespace = "com.contenido.gpssenderprototipe"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.contenido.gpssenderprototipe"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "2.3.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {
    //#Default
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.core:core:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")

    //#GPS
    implementation("com.google.android.gms:play-services-location:21.1.0")

    //#Firebase
    implementation("com.google.firebase:firebase-database:20.3.0")
    implementation ("com.google.firebase:firebase-firestore:17.1.0")
    implementation(platform("com.google.firebase:firebase-bom:32.7.2"))
    implementation("com.google.firebase:firebase-analytics")

    //#Background Task
    implementation("androidx.work:work-runtime:2.9.0") //Importante para que funcione la tarea de fondo!

    //#Default
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}