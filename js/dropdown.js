/*  ========================================================================  *\
    Programozás alapjai 1 - JavaScript
    Dropdown menü
\*  ========================================================================  */

document.addEventListener('DOMContentLoaded', function() {
    const textContainer = document.querySelector('.text-container');
    const dropdownContent = document.getElementById('dropdown-content');

    if (!textContainer || !dropdownContent) {
        console.error('Hiba: Nem található a textContainer vagy a dropdownContent!');
        return;
    }

    textContainer.addEventListener('click', function(event) {
        dropdownContent.classList.toggle('show');
        event.stopPropagation(); // Ne csukódjon be azonnal
    });

    // Ha bárhová kattintunk a dropdown kívül, akkor csukódjon be
    document.addEventListener('click', function(event) {
        if (!textContainer.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Tartalom betöltése az oldalról
    fetch('page/minesweeper-page.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hiba! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            dropdownContent.innerHTML = data;
        })
        .catch(error => {
            console.error('Hiba a dropdown tartalmának betöltésekor:', error);
            dropdownContent.innerHTML = '<p>Nem sikerült betölteni a tartalmat.</p>';
        });

    // CSS átmenet beállítása biztosan csak akkor, ha az elem létezik
    dropdownContent.style.transition = 'opacity 3s ease-in-out';
});