let targetNumber;
let expression = "";
let usedNumbers = [];
let submitted = false;
let timerInterval;

function generateTarget() {
  return Math.floor(Math.random() * 4801) + 200; // 200–5000
}

function updateDisplay() {
  document.getElementById("expression").innerText = expression;
}

function appendNumber(num) {
  if (usedNumbers.includes(num) || lastInputType === "number") return;
  expression += num.toString();
  usedNumbers.push(num);
  document.querySelector(`button[data-num="${num}"]`).disabled = true;
  lastInputType = "number";
  updateDisplay();
}

function appendOperator(op) {
  if (lastInputType !== "number") return;
  expression += op;
  lastInputType = "operator";
  updateDisplay();
}

function deleteLast() {
  if (!expression) return;
  const lastChar = expression.slice(-1);
  expression = expression.slice(0, -1);

  if (!isNaN(lastChar)) {
    const num = parseInt(lastChar);
    const idx = usedNumbers.indexOf(num);
    if (idx !== -1) usedNumbers.splice(idx, 1);
    const btn = document.querySelector(`button[data-num="${num}"]`);
    if (btn) btn.disabled = false;
    lastInputType = "operator";
  } else {
    lastInputType = "number";
  }

  updateDisplay();
}

function evalExpression(expr) {
  while (expr.includes("^")) {
    expr = expr.replace(/(\d+)\^(\d+)/, (_, base, exp) => `Math.pow(${base},${exp})`);
  }
  return eval(expr);
}

function showResult(message) {
  document.getElementById("result").innerText = message;
}

function endGame() {
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("deleteBtn").disabled = true;

  document.querySelectorAll(".num-btn").forEach(btn => btn.disabled = true);
  document.getElementById("playAgainBtn").style.display = "inline-block";

  if (!submitted) {
    showResult("⏰ Time's up!");
  }
}

function setupGame() {
  expression = "";
  usedNumbers = [];
  submitted = false;
  lastInputType = null;
  document.getElementById("expression").innerText = "";
  document.getElementById("result").innerText = "";
  document.getElementById("playAgainBtn").style.display = "none";

  targetNumber = generateTarget();
  document.getElementById("targetNumber").innerText = `🎯 ${targetNumber}`;

  // Generate number buttons
  const numContainer = document.getElementById("numberButtons");
  numContainer.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "num-btn";
    btn.setAttribute("data-num", i);
    btn.onclick = () => appendNumber(i);
    numContainer.appendChild(btn);
  }

  document.getElementById("submitBtn").disabled = false;
  document.getElementById("deleteBtn").disabled = false;

  // Timer
  let timeLeft = 45;
  document.getElementById("timer").innerText = `⏱️ ${timeLeft}`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `⏱️ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitted = true;
      endGame();
    }
  }, 1000);
}

// Submit button logic
document.getElementById("submitBtn").addEventListener("click", () => {
  if (submitted) return;
  submitted = true;
  clearInterval(timerInterval);

  const result = evalExpression(expression);
  const diff = Math.abs(targetNumber - result);

  const msg = result === targetNumber
    ? `🎯 Correct! Your result: ${result}`
    : `🔎 Your result: ${result} (Diff: ${diff})`;

  showResult(msg);
  endGame();
});

// Delete button
document.getElementById("deleteBtn").addEventListener("click", deleteLast);

// Play Again button
document.getElementById("playAgainBtn").addEventListener("click", setupGame);

// Start game
setupGame();
