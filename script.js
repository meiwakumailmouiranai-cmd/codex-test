const hands = ["グー", "チョキ", "パー"];
const handIcons = { グー: "✊", チョキ: "✌️", パー: "✋" };
const winningHands = { グー: "チョキ", チョキ: "パー", パー: "グー" };
const winsNeeded = 2;

const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const roundNumberElement = document.getElementById("round-number");
const messageElement = document.getElementById("message");
const handsResultElement = document.getElementById("hands-result");
const roundResultElement = document.getElementById("round-result");
const resetButton = document.getElementById("reset-button");
const handButtons = document.querySelectorAll(".hand-button");
const fireworksElement = document.getElementById("fireworks");
const computerReactionElement = document.getElementById("computer-reaction");
const drawReactionElement = document.getElementById("draw-reaction");
const countCallElement = document.getElementById("count-call");
const playerHandCard = document.getElementById("player-hand-card");
const computerHandCard = document.getElementById("computer-hand-card");
const playerHandIcon = document.getElementById("player-hand-icon");
const computerHandIcon = document.getElementById("computer-hand-icon");
const playerHandName = document.getElementById("player-hand-name");
const computerHandName = document.getElementById("computer-hand-name");

let playerWins = 0;
let computerWins = 0;
let roundNumber = 1;
let gameFinished = false;
let roundPlaying = false;
let animationId = 0;

function sleep(milliseconds) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, milliseconds);
  });
}

function getComputerHand() {
  return hands[Math.floor(Math.random() * hands.length)];
}

function judge(playerHand, computerHand) {
  if (playerHand === computerHand) return "draw";
  return winningHands[playerHand] === computerHand ? "win" : "lose";
}

function updateScore() {
  playerScoreElement.textContent = playerWins;
  computerScoreElement.textContent = computerWins;
  roundNumberElement.textContent = roundNumber;
}

function setHandButtonsDisabled(disabled) {
  handButtons.forEach(function (button) {
    button.disabled = disabled;
  });
}

function clearEffects() {
  fireworksElement.replaceChildren();
  computerReactionElement.classList.remove("is-laughing");
  computerReactionElement.setAttribute("aria-hidden", "true");
  drawReactionElement.classList.remove("is-visible");
  drawReactionElement.setAttribute("aria-hidden", "true");
}

function showFireworks() {
  const colors = ["#ff3f34", "#ffd32a", "#05c46b", "#0fbcf9", "#a55eea"];
  for (let burstIndex = 0; burstIndex < 5; burstIndex += 1) {
    const firework = document.createElement("div");
    firework.className = "firework";
    firework.style.setProperty("--x", `${15 + Math.random() * 70}vw`);
    firework.style.setProperty("--y", `${12 + Math.random() * 50}vh`);
    firework.style.setProperty("--color", colors[burstIndex % colors.length]);
    for (let sparkIndex = 0; sparkIndex < 16; sparkIndex += 1) {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.setProperty("--angle", `${sparkIndex * 22.5}deg`);
      spark.style.setProperty("--distance", `${60 + Math.random() * 70}px`);
      spark.style.animationDelay = `${burstIndex * 140}ms`;
      firework.appendChild(spark);
    }
    fireworksElement.appendChild(firework);
  }
  window.setTimeout(function () {
    fireworksElement.replaceChildren();
  }, 1800);
}

function showComputerLaugh() {
  computerReactionElement.classList.add("is-laughing");
  computerReactionElement.setAttribute("aria-hidden", "false");
}

function showDrawReaction() {
  drawReactionElement.classList.add("is-visible");
  drawReactionElement.setAttribute("aria-hidden", "false");
}

async function showCountCall(word, currentAnimationId) {
  countCallElement.textContent = word;
  countCallElement.classList.remove("is-visible");
  void countCallElement.offsetWidth;
  countCallElement.classList.add("is-visible");
  await sleep(650);
  return currentAnimationId === animationId;
}

function finishGame() {
  gameFinished = true;
  roundResultElement.textContent = playerWins === winsNeeded
    ? "3回勝負の結果：あなたの勝ちです！"
    : "3回勝負の結果：CPの勝ちです。";
  messageElement.textContent = "ゲーム終了です。「もう一度遊ぶ」で再挑戦できます。";
  setHandButtonsDisabled(true);
  resetButton.disabled = false;
}

async function playRound(playerHand) {
  if (gameFinished || roundPlaying) return;

  roundPlaying = true;
  animationId += 1;
  const currentAnimationId = animationId;
  const computerHand = getComputerHand();
  const result = judge(playerHand, computerHand);

  setHandButtonsDisabled(true);
  clearEffects();
  playerHandCard.classList.remove("is-revealed");
  computerHandCard.classList.remove("is-revealed");
  playerHandIcon.textContent = handIcons[playerHand];
  playerHandName.textContent = playerHand;
  computerHandName.textContent = "考え中…";
  computerHandIcon.classList.add("computer-cycling");
  roundResultElement.textContent = "勝負中…";
  roundResultElement.classList.add("is-waiting");
  messageElement.textContent = "CPが手を選んでいます。";

  const calls = ["じゃん", "けん", "ぽん！"];
  for (let callIndex = 0; callIndex < calls.length; callIndex += 1) {
    computerHandIcon.textContent = handIcons[hands[callIndex]];
    const shouldContinue = await showCountCall(calls[callIndex], currentAnimationId);
    if (!shouldContinue) return;
  }

  countCallElement.classList.remove("is-visible");
  computerHandIcon.classList.remove("computer-cycling");
  computerHandIcon.textContent = handIcons[computerHand];
  computerHandName.textContent = computerHand;
  playerHandCard.classList.add("is-revealed");
  computerHandCard.classList.add("is-revealed");
  handsResultElement.textContent = `あなた: ${playerHand} / CP: ${computerHand}`;

  await sleep(700);
  if (currentAnimationId !== animationId) return;

  roundResultElement.classList.remove("is-waiting");
  if (result === "draw") {
    roundResultElement.textContent = "あいこです！";
    showDrawReaction();
  } else if (result === "win") {
    playerWins += 1;
    roundResultElement.textContent = "あなたの勝ちです！";
    showFireworks();
  } else {
    computerWins += 1;
    roundResultElement.textContent = "あなたの負けです！";
    showComputerLaugh();
  }

  if (result !== "draw" && playerWins < winsNeeded && computerWins < winsNeeded) {
    roundNumber += 1;
  }
  updateScore();

  if (playerWins === winsNeeded || computerWins === winsNeeded) {
    finishGame();
  } else {
    messageElement.textContent = result === "draw" ? "同じ回戦でもう一度！" : "次の手を選んでください。";
    setHandButtonsDisabled(false);
  }
  roundPlaying = false;
}

function resetGame() {
  animationId += 1;
  playerWins = 0;
  computerWins = 0;
  roundNumber = 1;
  gameFinished = false;
  roundPlaying = false;
  clearEffects();
  countCallElement.classList.remove("is-visible");
  playerHandCard.classList.remove("is-revealed");
  computerHandCard.classList.remove("is-revealed");
  computerHandIcon.classList.remove("computer-cycling");
  playerHandIcon.textContent = "？";
  computerHandIcon.textContent = "？";
  playerHandName.textContent = "手を選んでね";
  computerHandName.textContent = "待機中";
  roundResultElement.classList.remove("is-waiting");
  roundResultElement.textContent = "勝負を始めましょう！";
  handsResultElement.textContent = "あなたとCPの手がここに表示されます。";
  messageElement.textContent = "下のボタンから手を選んでください。";
  updateScore();
  setHandButtonsDisabled(false);
  resetButton.disabled = true;
}

handButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    playRound(button.dataset.hand);
  });
});

resetButton.addEventListener("click", resetGame);
