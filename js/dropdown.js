/*  ========================================================================  *\

    D O P D O W N  M E N Ü  -  J a v a S c r i p t

\*  ========================================================================  */

document.addEventListener('DOMContentLoaded', function() {                // Az oldal betöltődése után fut le
    const textContainer = document.querySelector('.text-container');      // Az első olyan elem, amihez tartozik a text-container osztály
    const dropdownContent = document.getElementById('dropdown-content');  // Az elem, amiben a tartalom lesz

    if (!textContainer || !dropdownContent) {                                          // Ha valamelyik elem nem létezik, akkor hibaüzenet és kilépés
        console.error('Hiba: Nem található a textContainer vagy a dropdownContent!');  // Hibauzenet a konzolra
        return;                                                                        // Kilépés a függvényből
    }  

    textContainer.addEventListener('click', function(event) {  // Kattintásra
        dropdownContent.classList.toggle('show');              // A tartalom megjelenítése vagy elrejtése
        event.stopPropagation();                               // Az esemény továbbterjedésének megakadályozása
    });

    document.addEventListener('click', function(event) {                                         // Kattintásra az oldalon
        if (!textContainer.contains(event.target) && !dropdownContent.contains(event.target)) {  // Ha sem a textContainer, sem a dropdownContent nem tartalmazza a kattintott elemet
            dropdownContent.classList.remove('show');                                            // A tartalom elrejtése
        }
    });

    
    fetch('page/game-page.html')                                                // Az oldal tartalmának betöltése
        .then(response => {                                                            // Az oldal tartalmának betöltése
            if (!response.ok) {                                                        // Ha nem sikerült az oldal betöltése
                throw new Error(`HTTP hiba! Status: ${response.status}`);              // Hibaüzenet a konzolra
            }  
            return response.text();                                                    // Az oldal tartalmának visszaadása
        })
        .then(data => {                                                                // Az oldal tartalmának megjelenítése
            dropdownContent.innerHTML = data;                                          // Az oldal tartalmának megjelenítése
        })
        .catch(error => {                                                              // Hiba esetén
            console.error('Hiba a dropdown tartalmának betöltésekor:', error);         // Hibaüzenet a konzolra
            dropdownContent.innerHTML = '<p>Nem sikerült betölteni a tartalmat.</p>';  // Hibaüzenet a felhasználónak
        });


    dropdownContent.style.transition = 'opacity 3s ease-in-out';  // Az áttűnési idő beállítása
    dropdownContent.style.opacity = 0;                            // Az átlátszóság beállítása
    setTimeout(() => {                                            // Időzítés
        dropdownContent.style.opacity = 1;                        // Az átlátszóság beállítása
    }, 3000);                                                     // 3 másodperc múlva*/

});
