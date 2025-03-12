/*  ========================================================================  *\

     W A R N I N G  -  J a v a S c r i p t

\*  ========================================================================  */

function checkOrientation() {
    const maxWidth = 1024; // Csak mobil és tablet esetén aktív

    if (window.innerWidth <= maxWidth && window.innerWidth > window.innerHeight) {
        document.getElementById("landscape-warning").style.display = "flex";
    } else {
        document.getElementById("landscape-warning").style.display = "none";
    }
}

// Az oldal betöltésekor és az orientáció változásakor ellenőrizzük
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
document.addEventListener("DOMContentLoaded", checkOrientation);