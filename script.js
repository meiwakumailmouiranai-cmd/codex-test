// じゃんけんで使う手を配列にまとめます。
// 配列にすると、コンピューターの手をランダムに選ぶときに使いやすくなります。
const hands = ["グー", "チョキ", "パー"];

// 勝敗を判定するためのオブジェクトです。
// 左側の手は、右側の手に勝ちます。
const winningHands = {
  グー: "チョキ",
  チョキ: "パー",
  パー: "グー",
};

// 3回勝負なので、先に2勝したほうが勝ちです。
const winsNeeded = 2;

// HTMLにある表示場所やボタンをJavaScriptで使えるようにします。
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const roundNumberElement = document.getElementById("round-number");
const messageElement = document.getElementById("message");
const handsResultElement = document.getElementById("hands-result");
const roundResultElement = document.getElementById("round-result");
const resetButton = document.getElementById("reset-button");
const handButtons = document.querySelectorAll(".hand-button");

// ゲームの状態を保存する変数です。
let playerWins = 0;
let computerWins = 0;
let roundNumber = 1;
let gameFinished = false;

function getComputerHand() {
  // Math.random() は 0以上1未満のランダムな数を作ります。
  // Math.floor() で小数を切り捨てて、配列の番号として使います。
  const randomIndex = Math.floor(Math.random() * hands.length);
  return hands[randomIndex];
}

function judge(playerHand, computerHand) {
  // 同じ手なら引き分けです。
  if (playerHand === computerHand) {
    return "draw";
  }

  // winningHands[playerHand] は「プレイヤーの手が勝てる相手の手」です。
  if (winningHands[playerHand] === computerHand) {
    return "win";
  }

  // 引き分けでも勝ちでもない場合は、プレイヤーの負けです。
  return "lose";
}

function updateScore() {
  // textContent を使うと、HTMLの文字を安全に書き換えられます。
  playerScoreElement.textContent = playerWins;
  computerScoreElement.textContent = computerWins;
  roundNumberElement.textContent = roundNumber;
}

function hasWinner() {
  return playerWins === winsNeeded || computerWins === winsNeeded;
}

function finishGame() {
  gameFinished = true;

  if (playerWins === winsNeeded) {
    roundResultElement.textContent = "3回勝負の結果：あなたの勝ちです！おめでとうございます！";
  } else {
    roundResultElement.textContent = "3回勝負の結果：コンピューターの勝ちです。もう一度挑戦しましょう！";
  }

  messageElement.textContent = "ゲーム終了です。「もう一度遊ぶ」で最初から遊べます。";

  // ゲームが終わったら、手を選ぶボタンを押せないようにします。
  handButtons.forEach(function (button) {
    button.disabled = true;
  });

  resetButton.disabled = false;
}

function playRound(playerHand) {
  // ゲーム終了後に手のボタンが押されても、何もしないようにします。
  if (gameFinished) {
    return;
  }

  const computerHand = getComputerHand();
  const result = judge(playerHand, computerHand);

  handsResultElement.textContent = `あなた: ${playerHand} / コンピューター: ${computerHand}`;

  if (result === "draw") {
    roundResultElement.textContent = "あいこです！もう一度同じ回戦を行います。";
  } else if (result === "win") {
    playerWins += 1;
    roundResultElement.textContent = "あなたの勝ちです！";
  } else {
    computerWins += 1;
    roundResultElement.textContent = "あなたの負けです！";
  }

  // あいこ以外で、まだ勝負が終わっていなければ次の回戦に進みます。
  if (result !== "draw" && !hasWinner()) {
    roundNumber += 1;
  }

  updateScore();

  if (hasWinner()) {
    finishGame();
  } else {
    messageElement.textContent = "次の手を選んでください。";
  }
}

function resetGame() {
  playerWins = 0;
  computerWins = 0;
  roundNumber = 1;
  gameFinished = false;

  updateScore();
  messageElement.textContent = "下のボタンから手を選んでください。";
  handsResultElement.textContent = "あなたとコンピューターの手がここに表示されます。";
  roundResultElement.textContent = "勝負を始めましょう！";

  handButtons.forEach(function (button) {
    button.disabled = false;
  });

  resetButton.disabled = true;
}

// それぞれの手のボタンに「クリックされたときの処理」を登録します。
handButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    playRound(button.dataset.hand);
  });
});

// リセットボタンに「最初からやり直す処理」を登録します。
resetButton.addEventListener("click", resetGame);
