/*  ========================================================================  *\

    D O P D O W N  M E N Ü  -  J a v a S c r i p t

        A dropdown.js fájl a játék oldalának lenyíló menüjét kezeli.

    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        A fájl tartalma:
            - Eseménykezelők hozzáadása a kattintáshoz
            - Az oldal tartalmának betöltése
            - Animáció beállítása

        A fájlhoz tartozó CSS:
            - layout.css
            - components.css

        A fájlhoz tartozó HTML:
            - page/game-description-page.html

\*  ========================================================================  */

document.addEventListener('DOMContentLoaded', function() {  // Az oldal betöltődése után fut le
    const textContainer = document.getElementById('game-description');  // A kattintható elem
    const dropdownContent = document.getElementById('drop-down-content');  // A lenyíló tartalom

    if (!textContainer || !dropdownContent) {  // Ellenőrzés, hogy a szükséges elemek léteznek-e
        console.error('Hiba: Nem található a textContainer vagy a dropdownContent!');  // Hibakiírás a konzolra
        return;  // Kilépés
    }

    textContainer.addEventListener('click', function(event) {  // Eseménykezelő hozzáadása a kattintáshoz
        dropdownContent.classList.toggle('show');  // A lenyíló tartalom megjelenítése vagy elrejtése
        event.stopPropagation();  // Az esemény továbbterjedésének megakadályozása
    });

    document.addEventListener('click', function(event) {  // Eseménykezelő hozzáadása a kattintáshoz
        if (!textContainer.contains(event.target) && !dropdownContent.contains(event.target)) {  // Ha a kattintás nem a textContainer vagy a dropdownContent része
            dropdownContent.classList.remove('show');  // A lenyíló tartalom elrejtése
        }
    });

    fetch('page/game-description-page.html')  // Az oldal tartalmának betöltése
        .then(response => {  // A válasz feldolgozása
            if (!response.ok) {  // Ha a válasz nem rendben
                throw new Error(`HTTP hiba! Status: ${response.status}`);  // Hibaüzenet dobása
            }
            return response.text();  // A válasz szövegének visszaadása
        })
        .then(data => {  // A szöveg feldolgozása
            dropdownContent.innerHTML = data;  // A szöveg beillesztése a lenyíló tartalomba
            dropdownContent.style.opacity = 1;  // Az animáció elindítása
        })
        .catch(error => {  // Hiba esetén
            console.error('Hiba a dropdown tartalmának betöltésekor:', error);  // Hibakiírás a konzolra
            dropdownContent.innerHTML = '<p>Nem sikerült betölteni a tartalmat.</p>';  // Hibaüzenet megjelenítése
        });

    dropdownContent.style.transition = 'opacity 3s ease-in-out';  // Animáció beállítása
    dropdownContent.style.opacity = 0;  // Az animáció csak akkor indul, ha a tartalom betöltődött
});

/*  ========================================================================  *\
    E N D   O F   D O P D O W N   M E N Ü - J a v a S c r i p t   F I L E
\*  ========================================================================  */