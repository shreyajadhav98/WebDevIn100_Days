const grid = document.getElementById('grid');
const scoreSpan = document.getElementById('score');
const levelSpan = document.getElementById('level');
const messageEl = document.getElementById('message');
const replayBtn = document.getElementById('replayBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const root = document.documentElement;

let gridRows = 3, gridCols = 3;
let pattern = [];           // Array of [row, col]
let userInputs = [];
let level = 1;
let score = 0;
let accepting = false;
let gridMatrix = [];
let lightMode = true;
let animationTimeouts = [];

document.addEventListener('DOMContentLoaded', startGame);
replayBtn.onclick = () => startGame(true);
toggleModeBtn.onclick = toggleMode;

function startGame(isReplay = false) {
  clearAllTimeouts();
  gridRows = 3 + Math.floor((level-1)/2);
  gridCols = 3 + Math.floor((level-1)/3);
  if (isReplay) {
    level = 1;
    score = 0;
    updateHUD();
    setMessage('Good luck!');
  }
  userInputs = [];
  pattern = [];
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
  createCells();
  setTimeout(() => {
    generatePattern();
    flashPattern();
  }, 550);
}

function createCells() {
  gridMatrix = [];
  for (let r=0; r<gridRows; ++r) {
    let rowArr = [];
    for (let c=0; c<gridCols; ++c) {
      let cell = document.createElement('div');
      cell.className = "grid-cell";
      cell.tabIndex = 0;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => handleCellClick(r, c, cell);
      cell.onkeydown = (e) => { // accessibility
        if(e.key === 'Enter' || e.key === ' ') cell.click();
      };
      grid.appendChild(cell);
      rowArr.push(cell);
    }
    gridMatrix.push(rowArr);
  }
}

function generatePattern() {
  let steps = 2 + level + Math.floor(level/3);
  let totalCells = gridRows * gridCols;
  let indices = Array.from({length: totalCells}, (_,i) => i);
  for(let i=0; i<steps; ++i) {
    if(indices.length === 0) indices.push(...Array.from({length: totalCells}, (_,i)=>i));
    let idx = indices.splice(Math.floor(Math.random()*indices.length),1)[0];
    let row = Math.floor(idx/gridCols), col = idx%gridCols;
    pattern.push([row,col]);
  }
}

function flashPattern() {
  accepting = false;
  setMessage("Watch and memorize!");
  pattern.forEach(([r,c],i) => {
    let cell = gridMatrix[r][c];
    let t1 = setTimeout(()=>cell.classList.add('lit'), 700*i + 250);
    let t2 = setTimeout(()=>cell.classList.remove('lit'), 700*i + 700);
    animationTimeouts.push(t1, t2);
  });
  let totalTime = 700*pattern.length + 400;
  let t3 = setTimeout(()=>{
    setMessage("Your turn. Repeat the pattern!");
    accepting = true;
    userInputs = [];
    grid.focus();
  }, totalTime);
  animationTimeouts.push(t3);
}

function handleCellClick(r, c, cell) {
  if (!accepting) return;
  userInputs.push([r,c]);
  let [tr, tc] = pattern[userInputs.length-1] || [];
  if(r===tr && c===tc) {
    cell.classList.add('correct');
    if(userInputs.length === pattern.length) {
      accepting = false;
      score += 5*level + Math.max(0, 15-pattern.length)*2;
      setMessage("🎉 Level Complete! Next...");
      setTimeout(()=>{
        level++;
        updateHUD();
        startGame();
      }, 1200);
    }
  } else {
    cell.classList.add('wrong');
    highlightCorrectPattern();
    accepting = false;
    setMessage("❌ Wrong! Game Over. Final Level: "+level+'. Score: '+score);
    setTimeout(()=>{level=1;score=0;updateHUD();}, 800);
  }
  setTimeout(()=>cell.classList.remove('correct','wrong'), 500);
}

function highlightCorrectPattern() {
  pattern.forEach(([r,c],i)=>{
    setTimeout(()=>gridMatrix[r][c].classList.add('correct'), 150*i);
    setTimeout(()=>gridMatrix[r][c].classList.remove('correct'), 1250 + 100*i);
  });
}

function updateHUD() {
  scoreSpan.textContent = score;
  levelSpan.textContent = level;
}
function setMessage(msg) {
  messageEl.textContent = msg;
}

function toggleMode() {
  lightMode = !lightMode;
  if(lightMode){
    root.removeAttribute('data-theme');
    toggleModeBtn.textContent = "🌙";
  } else {
    root.setAttribute('data-theme','dark');
    toggleModeBtn.textContent = "☀️";
  }
}

function clearAllTimeouts() {
  animationTimeouts.forEach(clearTimeout);
  animationTimeouts = [];
}
