/*  ========================================================================  *\

    F I N D E R  -  J a v a S c r i p t  -  M i n e s w e e p e r
    
\*  ========================================================================  */

const bodyWidth = document.body.clientWidth;  // Szélesség
const bodyHeight = document.body.clientHeight;  // Magasság

const canvas = document.getElementById('myCanvas');  // Vászon
const c = canvas.getContext('2d');  // Rajzolás

const controlPanel = document.getElementById('control-panel');  // Vezérlőpanel
const controlPanelWidth = controlPanel.offsetWidth;  // Vezérlőpanel szélessége

let size;  // Méret
let columns;  // Oszlopok
let rows;  // Sorok
let mineCount;  // Aknák

const actionButton = document.getElementById('action-button');
const mineCounter = document.getElementById('mine-count');
const timeCounter = document.getElementById('time');

const images = {
  'hidden': document.getElementById('hidden'),
  'mine': document.getElementById('mine'),
  'explodedMine': document.getElementById('exploded-mine'),
  'flag': document.getElementById('flag'),
  'flaggedWrong': document.getElementById('flagged-wrong'),
  '0': document.getElementById('field-0'),
  '1': document.getElementById('field-1'),
  '2': document.getElementById('field-2'),
  '3': document.getElementById('field-3'),
  '4': document.getElementById('field-4'),
  '5': document.getElementById('field-5'),
  '6': document.getElementById('field-6'),
  '7': document.getElementById('field-7'),
  '8': document.getElementById('field-8'),
}

const buttons = {
  start: 'assets/button-start.png',
  lost: 'assets/button-lost.png',
  won: 'assets/button-won.png',
}

let isGameOver;
let isFirstClick;
let exploredFields;
let flagMap;
let map;
let exploredMap;
let remainingMines;
let timer;

const difficultySettings = {
  easy: {
    size: controlPanelWidth / 8,
    columns: 8,
    rows: 8,
    mineCount: 7
  },
  medium: {
    size: controlPanelWidth / 10,
    columns: 10,
    rows: 10,
    mineCount: 10
  },
  hard: {
    size: controlPanelWidth / 12,
    columns: 12,
    rows: 12,
    mineCount: 15
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

function setDifficulty(difficulty) {
  const settings = difficultySettings[difficulty];
  size = settings.size;
  canvas.width = settings.columns * size;
  canvas.height = settings.rows * size;
  columns = settings.columns;
  rows = settings.rows;
  mineCount = settings.mineCount;
  initGame();
}

document.getElementById('difficulty').addEventListener('change', function() {
  const difficulty = document.getElementById('difficulty').value;
  setDifficulty(difficulty);
});

actionButton.addEventListener('click', function() {
  const difficulty = document.getElementById('difficulty').value;
  setDifficulty(difficulty);
  stopTimer();
  timeCounter.innerText = convertNumberTo3DigitString(0);
});

canvas.addEventListener('click', function(event) {
  if (isGameOver) return;
  const x = event.offsetX;
  const y = event.offsetY;
  const col = Math.floor(x / size);
  const row = Math.floor(y / size);
  if (isFirstClick) {
    placeMines(map, mineCount, row, col);
    calculateFieldValues(map);
    isFirstClick = false;
    startTimer();
  }
  exploreField(row, col);
  drawMap();
  checkGameEnd(row, col);
});

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

function exploreField(row, col) {
  if (!exploredMap[row][col] && !flagMap[row][col]) {
    exploredFields++;
    exploredMap[row][col] = true;
    checkGameEnd(row, col);
    if (map[row][col] === 0) {
      let neighbourCoordinates = findNeighbourFields(map, row, col);
      for (let i = 0; i < neighbourCoordinates.length; i++) {
        let coordinate = neighbourCoordinates[i];
        exploreField(coordinate.row, coordinate.col);
      }
    }
  }
}

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