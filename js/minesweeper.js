/*  ========================================================================  *\

    F I N D E R  -  J a v a S c r i p t  -  M i n e s w e e p e r

    Készítette:  V M J  &  ASK

    Az aknakereső játék használata a Finder alkalmazásban.

    A játék célja, hogy a játékos felfedje az összes mezőt, amely nem tartalmaz
    aknát. Az aknák elhelyezkedése véletlenszerű, és a játékosnak a mezők
    felfedése során kell kiderítenie, hogy hol vannak az aknák.

    A játék véget ér, ha a játékos felfedi az összes mezőt, amely nem tartalmaz
    aknát, vagy ha az akna mezőt felfedi.

    A játékban a játékosnak lehetősége van zászlót helyezni azokra a mezőkre,
    amelyekről úgy gondolja, hogy aknát tartalmaznak. A játékos nyer, ha
    minden mezőt felfedett, és veszít, ha az akna mezőt felfedi.

    A játékban a játékosnak lehetősége van a játékot újraindítani, és a nehézségi
    szintet változtatni. A nehézségi szint változtatásával a játéktábla mérete
    és az aknák száma is változik.

    A játékban a játékosnak lehetősége van az időt mérni, amely a játék során
    eltelt időt mutatja.

    A játékban a játékosnak lehetősége van a játékot megállítani, ha úgy dönt,
    hogy nem szeretné folytatni a játékot.

    A játékban a játékosnak lehetősége van a játékot újraindítani, ha úgy
    dönt, hogy új játékot szeretne játszani.

    A játékban a játékosnak lehetősége van a játékot befejezni, ha a játékos
    nyert vagy vesztett.
    
\*  ========================================================================  */

/*  ========================================================================  *\
      C A N V A S  -  A N D  -  C O N T R O L  -  P A N E L
\*  ========================================================================  */

const bodyWidth = document.body.clientWidth;    // Szélesség
const bodyHeight = document.body.clientHeight;  // Magasság

const canvas = document.getElementById('myCanvas');  // Vászon
const c = canvas.getContext('2d');                   // Rajzolás

const controlPanel = document.getElementById('control-panel');  // Vezérlőpanel
const controlPanelWidth = controlPanel.offsetWidth;             // Vezérlőpanel szélessége

let size;       // Méret
let columns;    // Oszlopok
let rows;       // Sorok
let mineCount;  // Aknák


/*  ========================================================================  *\
      B U T T O N S  -  A N D  -  I M A G E S
\*  ========================================================================  */

const actionButton = document.getElementById('action-button');  // Akció gomb
const mineCounter = document.getElementById('mine-count');      // Akna számláló
const timeCounter = document.getElementById('time');            // Idő számláló

const buttons = {                    // Gombok
  start: 'assets/button-start.webp',   // Indítás
  lost: 'assets/button-lost.webp',     // Vesztett
  won: 'assets/button-won.webp',       // Nyert
};

const images = {                     // Képek
  'hidden': new Image(),               // Rejtett mező
  'mine': new Image(),                 // Akna
  'explodedMine': new Image(),         // Felrobbant akna
  '0': new Image(),                    // Mező 0
  '1': new Image(),                    // Mező 1
  '2': new Image(),                    // Mező 2
  '3': new Image(),                    // Mező 3
  '4': new Image(),                    // Mező 4
  '5': new Image(),                    // Mező 5
  '6': new Image(),                    // Mező 6
  '7': new Image(),                    // Mező 7
  '8': new Image(),                    // Mező 8
  'flag': new Image(),                 // Zászló
  'flaggedWrong': new Image(),         // Rossz zászló
};

images.hidden.src = 'assets/hidden.webp';  // Rejtett mező
images.mine.src = 'assets/mine.webp';    // Akna
images.explodedMine.src = 'assets/exploded-mine.webp';  // Felrobbant akna
images['0'].src = 'assets/0.webp';  // Mező 0
images['1'].src = 'assets/1.webp';  // Mező 1
images['2'].src = 'assets/2.webp';  // Mező 2
images['3'].src = 'assets/3.webp';  // Mező 3
images['4'].src = 'assets/4.webp';  // Mező 4
images['5'].src = 'assets/5.webp';  // Mező 5
images['6'].src = 'assets/6.webp';  // Mező 6
images['7'].src = 'assets/7.webp';  // Mező 7
images['8'].src = 'assets/8.webp';  // Mező 8
images.flag.src = 'assets/flag.webp';  // Zászló
images.flaggedWrong.src = 'assets/flagged-wrong.webp';  // Rossz zászló


/*  ========================================================================  *\
      V A R I A B L E S
\*  ========================================================================  */

let isGameOver;      // Játék vége
let isFirstClick;    // Első kattintás
let exploredFields;  // Felfedett mezők
let flagMap;         // Zászlók
let map;             // Térkép
let exploredMap;     // Felfedett mezők
let remainingMines;  // Hátralévő aknák
let timer;           // Időmérő


/*  ========================================================================  *\
      D I F F I C U L T Y  -  S E T T I N G S
\*  ========================================================================  */

const difficultySettings = {      // Nehézségi szint beállítások
  easy: {                           // Könnyű
    size: controlPanelWidth / 8,      // Méret
    columns: 8,                       // Oszlopok
    rows: 8,                          // Sorok
    mineCount: 8                      // Aknák
  },
  medium: {                          // Közepes
    size: controlPanelWidth / 10,      // Méret
    columns: 10,                       // Oszlopok
    rows: 10,                          // Sorok
    mineCount: 12                      // Aknák
  },
  hard: {                            // Nehéz
    size: controlPanelWidth / 12,      // Méret
    columns: 12,                       // Oszlopok
    rows: 12,                          // Sorok
    mineCount: 16                      // Aknák
  }
};


/*  ========================================================================  *\
      I N I T I A L I Z A T I O N  -  F U N C T I O N S
\*  ========================================================================  */

function initGame() {
  isGameOver = false;
  isFirstClick = true;
  exploredFields = 0;
  map = createMap();
  exploredMap = createBooleanMap();
  flagMap = createBooleanMap();
  whenAllImagesLoaded(drawMap);

  actionButton.classList.remove('won', 'lost');  // Nyert vagy vesztett gomb
  actionButton.classList.add('start');           // Alapértelmezett gomb

  remainingMines = mineCount;
  mineCounter.innerText = convertNumberTo3DigitString(remainingMines);
}


function loadDefaultGame() {
  const settings = difficultySettings['easy'];
  size = settings.size;
  columns = settings.columns;
  rows = settings.rows;
  mineCount = settings.mineCount;
  canvas.width = columns * size;
  canvas.height = rows * size;
  initGame();
}

function setDifficulty(difficulty) {                       // Nehézségi szint beállítása
  stopTimer();                                                 // Idő megállítása
  timeCounter.innerText = convertNumberTo3DigitString(0);      // Idő nullázása

  const settings = difficultySettings[difficulty];             // Nehézségi szint beállítások
  size = settings.size;                                        // Méret
  canvas.width = settings.columns * size;                      // Szélesség
  canvas.height = settings.rows * size;                        // Magasság
  columns = settings.columns;                                  // Oszlopok
  rows = settings.rows;                                        // Sorok
  mineCount = settings.mineCount;                              // Aknák
  
  initGame();                                                  // Játék inicializálása
}

document.getElementById('difficulty').addEventListener('change', function() {  // Nehézségi szint változtatása
  const difficulty = this.value;                                                   // Nehézségi szint
  setDifficulty(difficulty);                                                       // Nehézségi szint beállítása
});

actionButton.addEventListener('click', function() {
  const difficulty = document.getElementById('difficulty').value;
  setDifficulty(difficulty);
  stopTimer();
  timeCounter.innerText = convertNumberTo3DigitString(0);
});


/*  ========================================================================  *\
      L E F T  -  C L I C K  -  E V E N T S
\*  ========================================================================  */

canvas.addEventListener('click', function(event) {  // Kattintás esemény
  if (isGameOver) return;                               // Ha vége a játéknak, kilépünk

  const rect = canvas.getBoundingClientRect();          // Vászon mérete
  const scaleX = canvas.width / rect.width;             // Skála X
  const scaleY = canvas.height / rect.height;           // Skála Y

  const x = (event.clientX - rect.left) * scaleX;       // X
  const y = (event.clientY - rect.top) * scaleY;        // Y

  const col = Math.floor(x / size);                     // Oszlop
  const row = Math.floor(y / size);                     // Sor

  if (isFirstClick) {                                   // Első kattintás
    placeMines(map, mineCount, row, col);                   // Aknák elhelyezése
    calculateFieldValues(map);                              // Mező értékek kiszámítása
    isFirstClick = false;                                   // Első kattintás
    startTimer();                                           // Időmérő indítása
  }                                                     // Első kattintás

  exploreField(row, col);                               // Mező felfedése
  drawMap();                                            // Térkép rajzolása
  checkGameEnd(row, col);                               // Játék vége ellenőrzése
});                                                 // Kattintás esemény


/*  ========================================================================  *\
      R I G H T  -  C L I C K  -  E V E N T S
\*  ========================================================================  */

canvas.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  const x = event.offsetX;
  const y = event.offsetY;
  const col = Math.floor(x / size);
  const row = Math.floor(y / size);
  if (exploredMap[row][col]) {
    const neighbourCoordinates = findNeighbourFields(map, row, col);
    let flaggedNeighbours = countFlaggedNeighbours(neighbourCoordinates);
    if (flaggedNeighbours === map[row][col]) {
      for (let i = 0; i < neighbourCoordinates.length; i++) {
        let coordinate = neighbourCoordinates[i];
        exploreField(coordinate.row, coordinate.col);
      }
    }
  } else {
    flagMap[row][col] = !flagMap[row][col];
    remainingMines += flagMap[row][col] ? -1 : 1;
    mineCounter.innerText = convertNumberTo3DigitString(remainingMines);
  }
  drawMap();
  if (isGameOver) {
    showWrongFlags();
  }
});


/*  ========================================================================  *\
      C H E C K  -  G A M E  -  E N D
\*  ========================================================================  */

function checkGameEnd(row, col) {                                                 // Játék vége ellenőrzése
  if (map[row][col] === 'mine' && exploredMap[row][col]) {                          // Ha akna mezőt felfedtünk
    looseGame();                                                                      // Vesztes játék
    stopTimer();                                                                      // Időmérő megállítása
  } else if (exploredFields === rows * columns - mineCount && allMinesFlagged()) {    // Ha minden mezőt felfedtünk, és minden aknát zászlóztunk
    isGameOver = true;                                                                // Játék vége

    actionButton.classList.remove('start');                                           // Indítás gomb
    actionButton.classList.add('won');                                                // Nyert gomb

    stopTimer();                                                                      // Időmérő megállítása
  }
}

function allMinesFlagged() {                                     // Minden akna zászlózva
  for (let rowI = 0; rowI < rows; rowI++) {                        // Sorok
    for (let colI = 0; colI < columns; colI++) {                     // Oszlopok
      if (map[rowI][colI] === 'mine' && !flagMap[rowI][colI]) {        // Ha akna mező, és nincs rajta zászló
        return false;                                                    // Hamis
      }
    }
  }
  return true;                                                     // Igaz
}


/*  ========================================================================  *\
      T I M E R  -  F U N C T I O N S
\*  ========================================================================  */

function startTimer() {                                            // Időmérő indítása
  let seconds = 0;                                                   // Másodpercek
  timer = setInterval(function() {                                   // Időmérő
    seconds = Math.min(seconds + 1, 999);                              // Másodpercek
    timeCounter.innerText = convertNumberTo3DigitString(seconds);      // Időmérő
  }, 1000);                                                          // Időmérő
}                                                                  // Időmérő indítása

function stopTimer() {                                             // Időmérő megállítása
  clearInterval(timer);                                              // Időmérő
}                                                                  // Időmérő megállítása


/*  ========================================================================  *\
      L O O S E  -  G A M E
\*  ========================================================================  */

function looseGame() {                     // Vesztes játék
  isGameOver = true;                         // Játék vége

  actionButton.classList.remove('start');    // Indítás gomb
  actionButton.classList.add('lost');        // Vesztes gomb

  showWrongFlags();                          // Rossz zászlók
}


/*  ========================================================================  *\
      S H O W  -  W R O N G  -  F L A G S
\*  ========================================================================  */

function showWrongFlags() {                                        // Rossz zászlók
  for (let rowI = 0; rowI < rows; rowI++) {                          // Sorok
    for (let colI = 0; colI < columns; colI++) {                       // Oszlopok
      if (flagMap[rowI][colI] && map[rowI][colI] !== 'mine') {           // Ha zászló mező, és nem akna mező
        drawImage(images.flaggedWrong, colI * size, rowI * size);          // Rossz zászló
      }                                                            // Ha zászló mező, és nem akna mező
    }
  }
}


/*  ========================================================================  *\
      E X P L O R E  -  F I E L D
\*  ========================================================================  */

function exploreField(row, col) {                                         // Mező felfedése
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {      // Ha túlmegy a határon, kilépünk
      return;                                                                     // Kilépés
  }
  
  if (!exploredMap[row][col] && !flagMap[row][col]) {                         // Ha még nem felfedett mező, és nincs rajta zászló
      exploredFields++;                                                           // Felfedett mezők növelése
      exploredMap[row][col] = true;                                               // Felfedett mező
      checkGameEnd(row, col);                                                     // Játék vége ellenőrzése
      if (map[row][col] === 0) {                                                  // Ha a mező 0
          let neighbourCoordinates = findNeighbourFields(map, row, col);              // Szomszédos mezők
          for (let i = 0; i < neighbourCoordinates.length; i++) {                     // Végigmegyünk a szomszédos mezőkön
              let coordinate = neighbourCoordinates[i];                                   // Koordináta
              exploreField(coordinate.row, coordinate.col);                               // Mező felfedése
          }                                                                           // Végigmegyünk a szomszédos mezőkön
      }                                                                           // Ha a mező 0
  }                                                                           // Ha még nem felfedett mező, és nincs rajta zászló
}                                                                         // Mező felfedése


/*  ========================================================================  *\
      M A P  -  C R E A T I O N  -  F U N C T I O N S
\*  ========================================================================  */

function calculateFieldValues(map) {
  for (let rowI = 0; rowI < rows; rowI++) {
    for (let colI = 0; colI < columns; colI++) {
      let field = map[rowI][colI];
      if (field !== 'mine') {
        let neighbourCoordinates = findNeighbourFields(map, rowI, colI);
        let mineCount = countMines(map, neighbourCoordinates);
        map[rowI][colI] = mineCount;
      }
    }
  }
}


/*  ========================================================================  *\
      M A P  -  C O U N T  -  F U N
\*  ========================================================================  */

function countMines(map, coordinates) {
  let mineCount = 0;
  for (let i = 0; i < coordinates.length; i++) {
    let coordinate = coordinates[i];
    let field = map[coordinate.row][coordinate.col];
    if (field === 'mine') {
      mineCount++;
    }
  }
  return mineCount;
}


/*  ========================================================================  *\
      M A P  -  F L A G G E D  -  N E I G H B O U R S
\*  ========================================================================  */

function countFlaggedNeighbours(coordinates) {
  let flaggedNeighbours = 0;
  for (let i = 0; i < coordinates.length; i++) {
    let coordinate = coordinates[i];
    if (flagMap[coordinate.row][coordinate.col]) {
      flaggedNeighbours++;
    }
  }
  return flaggedNeighbours;
}


/*  ========================================================================  *\
      F I N D  -  N E I G H B O U R  -  F I E L D S
\*  ========================================================================  */

function findNeighbourFields(map, rowI, colI) {
  let neighbourCoordinates = [];
  for (let row = rowI - 1; row <= rowI + 1; row++) {
    for (let col = colI - 1; col <= colI + 1; col++) {
      if (row >= 0 && row < rows && col >= 0 && col < columns) {
        if (row !== rowI || col !== colI) {
          neighbourCoordinates.push({row: row, col: col});
        }
      }
    }
  }
  return neighbourCoordinates;
}


/*  ========================================================================  *\
      P L A C E  -  M I N E S
\*  ========================================================================  */

function placeMines(map, mineCount, startRow, startCol) {
  let mines = 0;
  while (mines < mineCount) {
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);

    if (map[y][x] !== 'mine' && Math.abs(x - startCol) > 1 && Math.abs(y - startRow) > 1) {
      map[y][x] = 'mine';
      mines++;
    }
  }
}


/*  ========================================================================  *\
      D R A W  -  M A P
\*  ========================================================================  */

function createMap() {
  let map = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < columns; i++) {
      row[i] = 0;
    }
    map[j] = row;
  }
  return map;
}

function createBooleanMap() {
  let exploredMap = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < columns; i++) {
      row[i] = false;
    }
    exploredMap[j] = row;
  }
  return exploredMap;
}

function drawMap() {
  for (let rowI = 0; rowI < rows; rowI++) {
    for (let colI = 0; colI < columns; colI++) {
      if (!exploredMap[rowI][colI]) {
        drawImage(images.hidden, colI * size, rowI * size);
        if (flagMap[rowI][colI]) {
          drawImage(images.flag, colI * size, rowI * size);
        }
      } else {
        let field = map[rowI][colI];
        let image = images[field];
        drawImage(image, colI * size, rowI * size);
      }
    }
  }
}

function drawImage(image, x, y) {
  c.clearRect(x, y, size, size); // Clear the previous image
  c.drawImage(image, x, y, size, size);
}


/*  ========================================================================  *\
      H E L P E R  -  F U N C T I O N S
\*  ========================================================================  */

function convertNumberTo3DigitString(number) {
  if (number < 0) {
    return '🤡';
  } else if (number < 10) {
    return '00' + number;
  } else if (number < 100) {
    return '0' + number;
  } else {
    return number;
  }
}

/*  ========================================================================  *\
      W A I T  -  F O R  -  I M A G E S  -  T O  -  L O A D
\*  ========================================================================  */

// This function waits until all images are loaded:

function whenAllImagesLoaded(onAllImagesLoaded, loadTime = 0) {
  const imageCount = Object.values(images).length;
  let loadedImages = 0;
  for (let image of Object.values(images)) {
    if (image.complete) {
      loadedImages++;
    }
  }

  if (loadedImages < imageCount && loadTime < 3000) {
    console.log('Waiting for images to load');
    setTimeout(() => {
      whenAllImagesLoaded(onAllImagesLoaded, loadTime + 100);
    }, 100);
  }
  if (loadTime >= 3000) {
    console.log('Images could not be loaded');
  } else if (imageCount === loadedImages) {
    onAllImagesLoaded();
  }
}

// Load the default game with "Easy" difficulty when the page is loaded
window.onload = loadDefaultGame;