/* ======================================================================== *\
   
    W I N D O W  O R I E N T A T I O N   L O C K  S C R I P T  F I L E
    -----------------------------------------------------------------------
    Az orientáció zárolására szolgáló JavaScript fájl.

\* ======================================================================== */

function keepPortraitOrientation() {
    // Ellenőrizzük, hogy az eszköz mobil vagy tablet-e (max. 768px szélesség)
    if (window.innerWidth <= 768) {
        // Ha az eszköz álló módba kerül, ne alkalmazzunk rotációt, és biztosítjuk, hogy a játék álló orientációban maradjon
        if (window.innerWidth < window.innerHeight) {
            document.body.style.transform = "none"; // Álló mód, ne forgassuk el
            document.body.style.width = "100vw";    // Szélességet állítunk, hogy mindig álló módú legyen
            document.body.style.height = "100vh";   // Magasságot állítunk, hogy mindig álló módú legyen
            document.body.style.overflow = "hidden"; // Ne látszódjon a görgetősáv
        } 
        // Ha az eszköz fekvő módba kerül, akkor a rotáció nem szükséges, csak az álló orientáció maradjon
        else if (window.innerWidth > window.innerHeight) {
            document.body.style.transform = "none"; // Ne forogjon el
            document.body.style.width = "100vw";    // Maradjon a portrait mód szélessége
            document.body.style.height = "100vh";   // Maradjon a portrait mód magassága
            document.body.style.overflow = "hidden"; // Ne legyen görgetősáv
        }
    } 
    // Ha az eszköz asztali számítógép, akkor nem kell változtatni
    else {
        document.body.style.transform = "none"; // Az asztali eszközöknél ne forgassuk el a képernyőt
        document.body.style.width = "100vw";    // A szélesség és magasság fixen legyen
        document.body.style.height = "100vh";   // Az asztali eszköznél nem kell további beállítás
        document.body.style.overflow = "auto";  // Görgetés engedélyezett, ha szükséges
    }
}

window.addEventListener("resize", keepPortraitOrientation); // Az eszköz elforgatásakor lefut a függvény
keepPortraitOrientation(); // Az oldal betöltésekor is lefut a függvény
