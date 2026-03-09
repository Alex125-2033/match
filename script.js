
// shared xp demo
const gainXpBtn = document.getElementById('gainXp');
const xpValue = document.getElementById('xpValue');
const levelValue = document.getElementById('levelValue');
const progressLabel = document.getElementById('progressLabel');
const dynamicFill = document.getElementById('dynamicFill');
const xpMirror = document.getElementById('xpMirror');
const levelMirror = document.getElementById('levelMirror');
const progressMirror = document.getElementById('progressMirror');
const dynamicFillMirror = document.getElementById('dynamicFillMirror');

let xp = 420;
let level = 5;
let percent = 84;

function syncXp() {
  xpValue.textContent = xp;
  levelValue.textContent = level;
  progressLabel.textContent = `${percent}%`;
  dynamicFill.style.width = `${percent}%`;
  xpMirror.textContent = xp;
  levelMirror.textContent = level;
  progressMirror.textContent = `${percent}%`;
  dynamicFillMirror.style.width = `${percent}%`;
}
syncXp();

if (gainXpBtn) {
  gainXpBtn.addEventListener('click', () => {
    xp += 25;
    percent += 5;
    if (percent >= 100) {
      level += 1;
      percent = 18;
    }
    syncXp();
    gainXpBtn.textContent = 'Задание выполнено ✓';
    setTimeout(() => gainXpBtn.textContent = 'Выполнить задание +25 XP', 900);
  });
}

// tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.game-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Memory game
const memoryGrid = document.getElementById('memoryGrid');
const memoryMoves = document.getElementById('memoryMoves');
const memoryPairs = document.getElementById('memoryPairs');
const memoryReset = document.getElementById('memoryReset');

let openCards = [];
let moves = 0;
let pairs = 0;
let lock = false;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function initMemory() {
  memoryGrid.innerHTML = '';
  const values = shuffle([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]);
  openCards = [];
  moves = 0;
  pairs = 0;
  lock = false;
  memoryMoves.textContent = moves;
  memoryPairs.textContent = pairs;

  values.forEach(value => {
    const btn = document.createElement('button');
    btn.className = 'memory-card';
    btn.dataset.value = value;
    btn.textContent = value;
    btn.addEventListener('click', () => handleMemory(btn));
    memoryGrid.appendChild(btn);
  });
}

function handleMemory(card) {
  if (lock || card.classList.contains('open') || card.classList.contains('matched')) return;
  card.classList.add('open');
  openCards.push(card);

  if (openCards.length === 2) {
    moves++;
    memoryMoves.textContent = moves;
    const [a,b] = openCards;
    if (a.dataset.value === b.dataset.value) {
      a.classList.add('matched');
      b.classList.add('matched');
      openCards = [];
      pairs++;
      memoryPairs.textContent = pairs;
      xp += 10; syncXp();
    } else {
      lock = true;
      setTimeout(() => {
        a.classList.remove('open');
        b.classList.remove('open');
        openCards = [];
        lock = false;
      }, 700);
    }
  }
}

memoryReset.addEventListener('click', initMemory);
initMemory();

// Fractions game
const fractionTask = document.getElementById('fractionTask');
const fracNum = document.getElementById('fracNum');
const fracDen = document.getElementById('fracDen');
const fractionCorrect = document.getElementById('fractionCorrect');
const fractionTotal = document.getElementById('fractionTotal');
const fractionMsg = document.getElementById('fractionMsg');
const checkFraction = document.getElementById('checkFraction');
const nextFraction = document.getElementById('nextFraction');

let fracA, fracB, fracAnsNum, fracAnsDen;
let correctCount = 0;
let totalCount = 0;

function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }

function newFractionTask() {
  const n1 = Math.floor(Math.random() * 8) + 1;
  const d1 = Math.floor(Math.random() * 7) + 2;
  const n2 = Math.floor(Math.random() * 8) + 1;
  const d2 = Math.floor(Math.random() * 7) + 2;
  fracA = {n:n1, d:d1};
  fracB = {n:n2, d:d2};
  let num = n1*d2 + n2*d1;
  let den = d1*d2;
  const g = gcd(num, den);
  fracAnsNum = num / g;
  fracAnsDen = den / g;
  fractionTask.textContent = `${n1}/${d1} + ${n2}/${d2} = ?`;
  fracNum.value = '';
  fracDen.value = '';
  fractionMsg.textContent = '';
  fractionMsg.className = 'answer-note';
}

checkFraction.addEventListener('click', () => {
  totalCount++;
  fractionTotal.textContent = totalCount;
  const userNum = Number(fracNum.value);
  const userDen = Number(fracDen.value);
  if (userNum === fracAnsNum && userDen === fracAnsDen) {
    correctCount++;
    fractionCorrect.textContent = correctCount;
    fractionMsg.textContent = 'Верно! +15 XP';
    fractionMsg.className = 'answer-note ok';
    xp += 15; syncXp();
  } else {
    fractionMsg.textContent = `Неверно. Правильный ответ: ${fracAnsNum}/${fracAnsDen}`;
    fractionMsg.className = 'answer-note bad';
  }
});
nextFraction.addEventListener('click', newFractionTask);
newFractionTask();

// Expression game
const exprTarget = document.getElementById('exprTarget');
const exprChips = document.getElementById('exprChips');
const exprInput = document.getElementById('exprInput');
const exprMsg = document.getElementById('exprMsg');
const checkExpression = document.getElementById('checkExpression');
const nextExpression = document.getElementById('nextExpression');

let currentNumbers = [];
let currentTarget = 10;

function newExpressionTask() {
  currentNumbers = Array.from({length: 3}, () => Math.floor(Math.random() * 9) + 1);
  const possibleTarget = currentNumbers[0] + currentNumbers[1] + currentNumbers[2];
  currentTarget = Math.random() > 0.5 ? possibleTarget : currentNumbers[0] * currentNumbers[1] - currentNumbers[2];
  if (currentTarget < 1) currentTarget = possibleTarget;
  exprTarget.textContent = currentTarget;
  exprChips.innerHTML = '';
  currentNumbers.forEach(n => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = n;
    exprChips.appendChild(chip);
  });
  ['+', '-', '*', '/'].forEach(op => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = op;
    exprChips.appendChild(chip);
  });
  exprInput.value = '';
  exprMsg.textContent = '';
  exprMsg.className = 'answer-note';
}

checkExpression.addEventListener('click', () => {
  const value = exprInput.value.trim();
  if (!value) return;

  try {
    const allowed = /^[0-9+\-*/()\s]+$/;
    if (!allowed.test(value)) throw new Error('bad');
    const result = Function(`"use strict"; return (${value})`)();
    if (Math.abs(result - currentTarget) < 0.0001) {
      exprMsg.textContent = 'Верно! +20 XP';
      exprMsg.className = 'answer-note ok';
      xp += 20; syncXp();
    } else {
      exprMsg.textContent = `Получилось ${result}, а нужна цель ${currentTarget}.`;
      exprMsg.className = 'answer-note bad';
    }
  } catch {
    exprMsg.textContent = 'Введите корректное арифметическое выражение.';
    exprMsg.className = 'answer-note bad';
  }
});
nextExpression.addEventListener('click', newExpressionTask);
newExpressionTask();
