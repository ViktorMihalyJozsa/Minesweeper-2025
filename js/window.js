/* ================================================================================================================ *\

    W I N D O W . J S
    -----------------

    A fájl tartalma:

    * Az eszköz elforgatásakor és a képernyőméret változásakor a függvény biztosítja, hogy a játék mindig a megfelelő
        orientációban jelenjen meg. Az asztali számítógépeken nem változtatja az orientációt, csak a mobil eszközöknél
        biztosítja, hogy a játék mindig a megfelelő módban jelenjen meg.

    * Az eszköz elforgatásakor a függvény 90 fokos elforgatást alkalmaz, és biztosítja, hogy a játék fekvő orientációban
        maradjon. Ha az eszköz álló módba kerül, akkor a függvény biztosítja, hogy a játék álló orientációban maradjon.

    * Az eszköz elforgatásakor és a képernyőméret változásakor a függvény lefut, és biztosítja, hogy a játék mindig a
        megfelelő orientációban jelenjen meg. Az asztali számítógépeken nem változtatja az orientációt, csak a mobil 
        eszközökön biztosítja, hogy a játék mindig a megfelelő módban jelenjen meg.

 \* =============================================================================================================== */

function keepPortraitOrientation() {
    if (window.innerWidth <= 1024) {
        // Ha az eszköz álló módba kerül, ne alkalmazzunk rotációt, és biztosítjuk, 
        // hogy a játék álló orientációban maradjon
        if (window.innerWidth < window.innerHeight) {
            document.body.style.transform = "none";   // Álló mód, ne forgassuk el
            document.body.style.width = "100%";       // Szélességet állítunk, hogy mindig álló módú legyen
            document.body.style.height = "100%";      // Magasságot állítunk, hogy mindig álló módú legyen
            document.body.style.overflow = "hidden";  // Ne látszódjon a görgetősáv
        } 
        // Ha az eszköz fekvő módba kerül, akkor 90 fokos elforgatást alkalmazunk, és biztosítjuk, 
        // hogy a játék fekvő orientációban maradjon
        else if (window.innerWidth > window.innerHeight) {
            document.body.style.transform = "rotate(90deg)";        // 90 fokos elforgatás
            document.body.style.width = `${window.innerHeight}px`;  // Az új szélesség
            document.body.style.height = `${window.innerWidth}px`;  // Az új magasság
            document.body.style.overflow = "hidden";                // Ne legyen görgetősáv
        }
    } 
    // Ha az eszköz asztali számítógép, akkor nem kell változtatni
    else {
        document.body.style.transform = "none";  // Az asztali eszközöknél ne forgassuk el a képernyőt
        document.body.style.width = "100%";      // A szélesség és magasság fixen legyen
        document.body.style.height = "100%";     // Az asztali eszköznél nem kell további beállítás
        document.body.style.overflow = "auto";   // Görgetés engedélyezett, ha szükséges
    }
}

// Az eszköz elforgatásakor és a képernyőméret változásakor lefut a függvény
window.addEventListener("resize", keepPortraitOrientation);              // Az ablak átméretezésekor lefut a függvény
window.addEventListener("orientationchange", keepPortraitOrientation);   // Az eszköz elforgatásakor lefut a függvény
document.addEventListener("DOMContentLoaded", keepPortraitOrientation);  // Az oldal betöltésekor is lefut a függvény
keepPortraitOrientation();                                               // Az oldal betöltésekor is lefut a függvény