const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在canvas內畫圖

const unit = 20; //每一個蛇的單位
const row = canvas.height / unit;
const column = canvas.width / unit;

//讓程式碼追蹤蛇的部位 -> 讓他記錄蛇的每一個身體的x,y在哪裡

let snake = []; //array中的每一個元素，都是一個物件
//物件的工作是儲存蛇部位的x y座標

function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//完成身體製作 準備讓蛇動起來囉

//果實設定
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  //確認果實的心隨機點是否跟蛇重疊
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每次按下上下左右鍵之後，在下一正被畫出來之前
  //不接受任何keydown事件
  //這樣可以防止案件導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數" + score;
document.getElementById("myScore2").innerHTML = "最高遊戲分數" + highestScore;

//蛇動起來的邏輯 想成array 將array[3] snake.pop() 然後在前方snake.unshift() 須考慮新增加的這一點x y是啥
//也就是說 隨著direction變換 新的unshift的這個值要如何變換
// if direction ==Right 頭x+=unit    if direction ==Down 頭y+=unit
// if direction ==Left 頭x-=unit    if direction ==Up 頭y-=unit

function draw() {
  //每次畫圖前確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //若沒有設定canvas畫新的東西上去會直接覆蓋 所以背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    //穿牆功能
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // .fillStyle 接下來要填滿的顏色
    // x y width height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //填滿長方形
    ctx.strokeRect(snake[i].x, snake[i], unit, unit);
  }

  //以目前的d變數方向 來決定下一幀要放在哪一個座標
  let snakeX = snake[0].x; //snake[0]是個物件 但snake[0].x是個number
  let snakeY = snake[0].y;
  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //蛇吃到果實身體變長  不執行snake.pop() 執行snake.unshift()
  //若沒有吃到   執行snake.pop() 執行snake.unshift()

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++;
    document.getElementById("myScore").innerHTML = "遊戲分數" + score; //更新分數版
    setHighestScore(score);
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
