/*  ========================================================================  *\

     W A R N I N G  -  J a v a S c r i p t

        A warning.js fájl a játék oldalának orientációját ellenőrzi.

    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        A fájl tartalma:
            - Az orientáció ellenőrzése
            - Az orientáció változásának figyelése
            - Az orientációhoz tartozó figyelmeztetés 
              megjelenítése és eltüntetése animációval

        A fájlhoz tartozó CSS:
            - layout.css
            - components.css

\*  ========================================================================  */


document.addEventListener("DOMContentLoaded", checkOrientation);

function checkOrientation() {
    const warning = document.getElementById("warning");
    if (!warning) return;

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const maxWidth = 768;

    // Ha vízszintes tájolásban vagyunk és az ablak szélessége <= maxWidth
    if (isLandscape && window.innerWidth <= maxWidth) {
        warning.style.display = "flex";
        setTimeout(() => warning.classList.add("show"), 10); // Figyelmeztetés megjelenítése
    } else {
        warning.classList.remove("show");
        setTimeout(() => {
            if (!warning.classList.contains("show")) {
                warning.style.display = "none"; // Figyelmeztetés eltüntetése
            }
        }, 500); // Figyelmeztetés eltüntetése 500ms múlva
    }
}

// Az események, amelyek figyelik az ablak módosulását
document.addEventListener("DOMContentLoaded", () => {
    const warning = document.getElementById("warning");
    if (warning) {
        warning.addEventListener("transitionend", () => {
            if (!warning.classList.contains("show")) {
                warning.style.display = "none";
            }
        });
    }
});

window.addEventListener("resize", checkOrientation);             // Az ablak méretének változásának figyelése
window.addEventListener("orientationchange", checkOrientation);  // Az orientáció változásának figyelése
window.addEventListener("load", checkOrientation);               // Az oldal betöltésekor az orientáció ellenőrzése


/*  ========================================================================  *\
      E N D   O F   W A R N I N G - J a v a S c r i p t   F I L E
\*  ========================================================================  */