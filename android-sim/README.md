# Kudizy Caisse Sim — APK Android (WebView)

Coquille Android **API 29+ (Android 10 → 15)** qui charge la simulation PWA :

https://kudizy.github.io/pos-simulation/caisse-sim/

Même principe que l’app prod : WebView plein écran. Pas encore de pont Bluetooth.

## Installer l’APK (téléphone)

1. Télécharger l’artifact **`kudizy-caisse-sim-debug`** du dernier workflow GitHub Actions  
   (ou le fichier `app-debug.apk` joint à la release / Actions).
2. Sur le téléphone : autoriser l’install depuis sources inconnues pour ce fichier.
3. Ouvrir **Kudizy Caisse Sim** — la caisse B1–B3 s’affiche (réseau requis).

PIN démo : `1234` ou `4821`.

## Build local (Android Studio / SDK)

```bash
cd Pos/android-sim
./gradlew :app:assembleDebug
# APK → app/build/outputs/apk/debug/app-debug.apk
```
