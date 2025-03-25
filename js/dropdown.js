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

document.addEventListener('DOMContentLoaded', function() {
    const textContainer = document.getElementById('game-description'); 
    const dropdownContent = document.getElementById('drop-down-content'); 

    if (!textContainer || !dropdownContent) {  
        console.error('Hiba: Nem található a textContainer vagy a dropdownContent!');
        return;
    }

    textContainer.addEventListener('click', function(event) { 
        dropdownContent.classList.toggle('show'); 
        event.stopPropagation(); 
    });

    document.addEventListener('click', function(event) {
        if (!textContainer.contains(event.target) && !dropdownContent.contains(event.target)) {  
            dropdownContent.classList.remove('show');  
        }
    });

    // Itt töltöd be a tartalmat AJAX segítségével
    fetch('page/game-description-page.html') 
        .then(response => {
            if (!response.ok) { 
                throw new Error(`HTTP hiba! Status: ${response.status}`); 
            }
            return response.text(); 
        })
        .then(data => {
            dropdownContent.innerHTML = data; 
            dropdownContent.style.opacity = 1; 
        })
        .catch(error => { 
            console.error('Hiba a dropdown tartalmának betöltésekor:', error);  
            dropdownContent.innerHTML = '<p>Nem sikerült betölteni a tartalmat.</p>'; 
        });

    dropdownContent.style.transition = 'opacity 3s ease-in-out'; 
    dropdownContent.style.opacity = 0; 
});


/*  ========================================================================  *\
    E N D   O F   D O P D O W N   M E N Ü - J a v a S c r i p t   F I L E
\*  ========================================================================  */