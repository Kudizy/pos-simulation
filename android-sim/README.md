# Kudizy Caisse Sim — APK Android (WebView)

Coquille **Android 10+ (API 29 → 35)** : WebView plein écran sur la simulation PWA.

URL chargée : https://kudizy.github.io/pos-simulation/caisse-sim/

## Télécharger & installer sur ton téléphone

APK debug (réseau requis) :

**[KudizyCaisseSim-0.1.0-debug.apk](./dist/KudizyCaisseSim-0.1.0-debug.apk)**

Aussi sur GitHub :  
https://github.com/Kudizy/pos-simulation/raw/main/android-sim/dist/KudizyCaisseSim-0.1.0-debug.apk

1. Envoie l’APK sur le téléphone (AirDrop, Drive, câble…).
2. Autorise l’installation depuis cette source.
3. Ouvre **Kudizy Caisse Sim**.
4. PIN démo : `1234` ou `4821`.

Package id : `bj.kudizy.caissesim.debug`

## Build local

```bash
cd Pos/android-sim
# SDK + JDK déjà utilisables si .tools/ présent, sinon Android Studio
./gradlew :app:assembleDebug
```
