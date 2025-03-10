/* ======================================================================== *\
   
    W I N D O W  O R I E N T A T I O N   L O C K  S C R I P T  F I L E
    -----------------------------------------------------------------------
    Az orientáció zárolására szolgáló JavaScript fájl.

\* ======================================================================== */

    function lockOrientation() {                                                   // Az orientáció zárolását végző függvény
        if (window.innerWidth <= 768 && window.innerWidth > window.innerHeight) {      // Ha a képernyő szélessége kisebb, mint 768 pixel, és a szélesség nagyobb, mint a magasság

            screen.orientation.lock('portrait').catch(function(err) {                      // Az orientáció zárolása portré módba
                console.error("Az orientáció nem zárható le:", err);                           // Hibaüzenet, ha nem sikerül az orientáció zárolása
            });                                                                            // Az orientáció zárolásának hibakezelése
        }                                                                              // Az orientáció zárolásának hibakezelése
    }
      
      window.addEventListener("resize", lockOrientation);  // Az orientáció zárolásának eseményfigyelője
      lockOrientation();                                   // Az orientáció zárolása
       