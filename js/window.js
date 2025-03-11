/* ===================
    Mobil eszközökön az orientáció zárolása
=================== */

// Ez a függvény zárolja az orientációt álló módra
function lockOrientation() {
    if (window.innerWidth <= 1024) { // Csak mobilokon és tableteken
        // Az orientáció figyelése, ha elforgatják, visszaállítjuk álló módra
        window.addEventListener('orientationchange', function() {
            if (window.orientation === 90 || window.orientation === -90) {
                // Ha az eszköz fekvő módban van, visszaforgatjuk álló módba
                document.body.style.transform = "none";
                document.body.style.width = "100vw";
                document.body.style.height = "100vh";
                document.body.style.overflow = "hidden";
            }
        });
        
        // Az oldal betöltésekor is beállítjuk az álló módot
        document.body.style.transform = "none";
        document.body.style.width = "100vw";
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
    }
}

document.addEventListener("DOMContentLoaded", lockOrientation); // Oldal betöltésekor is lefut