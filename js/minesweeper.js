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

const actionButton = document.getElementById('action-button');  // Akció gomb
const mineCounter = document.getElementById('mine-count');      // Akna számláló
const timeCounter = document.getElementById('time');            // Idő számláló

const images = {                                             // Képek
  'hidden': document.getElementById('hidden'),               // Rejtett
  'mine': document.getElementById('mine'),                   // Akna
  'explodedMine': document.getElementById('exploded-mine'),  // Felrobbant akna
  'flag': document.getElementById('flag'),                   // Zászló
  'flaggedWrong': document.getElementById('flagged-wrong'),  // Rossz zászló
  '0': document.getElementById('field-0'),                   // Mező 0
  '1': document.getElementById('field-1'),                   // Mező 1
  '2': document.getElementById('field-2'),                   // Mező 2
  '3': document.getElementById('field-3'),                   // Mező 3
  '4': document.getElementById('field-4'),                   // Mező 4
  '5': document.getElementById('field-5'),                   // Mező 5
  '6': document.getElementById('field-6'),                   // Mező 6
  '7': document.getElementById('field-7'),                   // Mező 7
  '8': document.getElementById('field-8'),                   // Mező 8
}

const buttons = {                    // Gombok
  start: 'assets/button-start.png',  // Indítás
  lost: 'assets/button-lost.png',    // Vesztett
  won: 'assets/button-won.png',      // Nyert
}

let isGameOver;      // Játék vége
let isFirstClick;    // Első kattintás
let exploredFields;  // Felfedett mezők
let flagMap;         // Zászlók
let map;             // Térkép
let exploredMap;     // Felfedett mezők
let remainingMines;  // Hátralévő aknák
let timer;           // Időmérő

const difficultySettings = {      // Nehézségi szint beállítások
  easy: {                         // Könnyű
    size: controlPanelWidth / 8,  // Méret
    columns: 8,                   // Oszlopok
    rows: 8,                      // Sorok
    mineCount: 7                  // Aknák
  },
  medium: {                        // Közepes
    size: controlPanelWidth / 10,  // Méret
    columns: 10,                   // Oszlopok
    rows: 10,                      // Sorok
    mineCount: 10                  // Aknák
  },
  hard: {                          // Nehéz
    size: controlPanelWidth / 12,  // Méret
    columns: 12,                   // Oszlopok
    rows: 12,                      // Sorok
    mineCount: 15                  // Aknák
  }
};

function initGame() {
  isGameOver = false;
  isFirstClick = true;
  exploredFields = 0;
  map = createMap();
  exploredMap = createBooleanMap();
  flagMap = createBooleanMap();
  whenAllImagesLoaded(drawMap);
  actionButton.src = buttons.start;
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
      C L I C K  -  E V E N T
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

function checkGameEnd(row, col) {
  if (map[row][col] === 'mine' && exploredMap[row][col]) {
    looseGame();
    stopTimer();
  } else if (exploredFields === rows * columns - mineCount) {
    isGameOver = true;
    actionButton.src = buttons.won;
    stopTimer();
  }
}

function startTimer() {
  let seconds = 0;
  timer = setInterval(function() {
    seconds = Math.min(seconds + 1, 999);
    timeCounter.innerText = convertNumberTo3DigitString(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function looseGame() {
  isGameOver = true;
  actionButton.src = buttons.lost;
  showWrongFlags();
}

function showWrongFlags() {
  for (let rowI = 0; rowI < rows; rowI++) {
    for (let colI = 0; colI < columns; colI++) {
      if (flagMap[rowI][colI] && map[rowI][colI] !== 'mine') {
        drawImage(images.flaggedWrong, colI * size, rowI * size);
      }
    }
  }
}


/*  ========================================================================  *\
      M A P  -  F U N C T I O N S
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

function placeMines(map, mineCount, startRow, startCol) {
  let mines = 0;
  while (mines < mineCount) {
    let x = Math.floor(Math.random() * columns);
    let y = Math.floor(Math.random() * rows);
    if (x !== startCol && y !== startRow && map[y][x] !== 'mine') {
      map[y][x] = 'mine';
      mines++;
    }
  }
}

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
  c.drawImage(image, x, y, size, size);
}

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
     L O A D I N G  -  F U N C T I O N
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