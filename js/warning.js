/*  ========================================================================  *\

     W A R N I N G  -  J a v a S c r i p t

        A warning.js fájl a játék oldalának orientációját ellenőrzi.

    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        A fájl tartalma:
            - Az orientáció ellenőrzése
            - A figyelmeztetés megjelenítése

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

    if (isLandscape && window.innerWidth <= maxWidth) {
        warning.style.display = "flex";
        setTimeout(() => warning.classList.add("show"), 10);
    } else {
        warning.classList.remove("show");
        setTimeout(() => {
            if (!warning.classList.contains("show")) {
                warning.style.display = "none";
            }
        }, 500);
    }
}

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

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);


/*  ========================================================================  *\
      E N D   O F   W A R N I N G - J a v a S c r i p t   F I L E
\*  ========================================================================  */