let cards = [
  "2C_1",
  "2C_1",
  "3C_1",
  "3C_1",
  "4D_1",
  "4D_1",
  "8C_1",
  "8C_1",
  "11H_1",
  "11H_1",
  "AC_1",
  "AC_1",
  "10S_1",
  "10S_1",
  "6D_1",
  "6D_1",
  // "7H",
  // "7H",
  // "9D",
  // "9D",
  // "10C",
  // "10C",
  // "8D",
  // "8D",
  // "5D",
  // "5D",
  // "6D",
  // "6D",
  // "10H",
  // "10H",
  // "6H",
  // "6H",
  // "AH",
  // "AH",
  // "AS",
  // "AS",
  // "JC",
  // "JC",
  // "JD",
  // "JD",
];
let cards1 =[
    'boy_2',
    'boy_2',
    "city_2",
    "city_2",
    "pig_2",
    "pig_2",
    "tiger_2",
    "tiger_2",
    "dog_2",
    "dog_2",
    "duck_2",
    "duck_2",
    "fox_2",
    "fox_2",
    "rabbit_2",
    "rabbit_2",
];
let cards2 =[
  "7H_1",
  "7H_1",
  "9D_1",
  "9D_1",
  "10C_1",
  "10C_1",
  "8D_1",
  "8D_1",
  "5D_1",
  "5D_1",
  "6D_1",
  "6D_1",
  "10H_1",
  "10H_1",
  "6H_1",
  "6H_1",
]

let cards3 =[
  'boy_2',
  'boy_2',
  "city_2",
  "city_2",
  "pig_2",
  "pig_2",
  "tiger_2",
  "tiger_2",
  "AH_1",
  "AH_1",
  "AS_1",
  "AS_1",
  "JC_1",
  "JC_1",
  "JD_1",
  "JD_1",
]
const missions = [6, 7, 8, 9, 10, 12, 15];
const triggers = [
  "小子你到底行不行？",
  "要幫忙代購銀杏嗎？",
  "我先去睡一下。",
  "你回家練練再來！",
  "怎麼比我這個老人糊塗。",
  "就在那！還找不到？真是！",
  "你還是去玩沙吧。",
  "晚餐吃什麼好呢？",
  "到了再叫醒我。",
];
const cardpool = document.getElementById("cardpool");
const body = document.getElementsByTagName("body")[0];
const trigger = document.getElementById("trigger");
const mission = document.getElementById("mission");

let currentMission = null;
let currentTrigger = "";
let errorTurns = 0;
let openCards = [];
let challengeAccepted = false;
let lost = false;
let unmatching = false;
// 開局看牌時間
let openTime = 2000;

let errorFirst = null;
let errorSecond = null;
let success = false;

function startGame() {
  if (document.getElementsByClassName("card").length > 1) {
    document.querySelectorAll(".card").forEach((node) => node.remove());
  }

  body.style.overflow = "hidden";
  let random = Math.random();

  let curCards;
  if(random>0&&random<0.3){
    curCards = cards;
  }else if(random>=0.3&&random<0.6){
    curCards = cards1;
  }else if(random>=0.6&&random<0.8){
    curCards = cards2;
  }else{
    curCards = cards3;
  }
  const shuffledCards = shuffle(curCards);
  assignMission();
  document.getElementById("accept").addEventListener("click", acceptChallenge);
  shuffledCards.forEach((card) => {
    let cardTag = document.createElement("div");
    cardTag.classList.add("card", "open");
    cardTag.dataset.value = card;
    let str = card.split("_");
    let type = str[1];
    if(type == "2"){
      cardTag.innerHTML = `<img class="cardBack" src="./public/svg/${card}.png" /><img class="cardCover" src=./public/svg/Card_back.svg />`;
    }else{
      cardTag.innerHTML = `<img class="cardBack" src="./public/svg/${card}.svg" /><img class="cardCover" src=./public/svg/Card_back.svg />`;
    }
    // cardTag.innerHTML = `<img class="cardBack" src="./public/svg/${card}.svg" /><img class="cardCover" src=./public/svg/Card_back.svg />`;
    cardpool.appendChild(cardTag);
  });
}

function acceptChallenge() {
  challengeAccepted = true;
  body.style.overflow = "auto";
  mission.style.visibility = "hidden";
  setTimeout(() => {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("open");
      card.addEventListener("click", handleMatch);
    });
  }, openTime);
}

function shuffle(arr) {
  let elementIdx = arr.length,
    randomIdx,
    temp;

  while (elementIdx !== 0) {
    randomIdx = getRandom(arr);
    elementIdx -= 1;
    temp = arr[randomIdx];
    arr[randomIdx] = arr[elementIdx];
    arr[elementIdx] = temp;
  }

  return arr;
}

function openCard() {}


function handleMatch(e) {
  if (e.currentTarget.classList.contains("open") || unmatching || lost) return;

  e.currentTarget.classList.add("open");

  if(errorFirst!=null && errorSecond!=null){
    errorFirst.classList.remove("open");
    errorSecond.classList.remove("open");
    openCards = [];
    if (openCards.length < 2) {
      openCards.push(e.currentTarget);
    }
    errorFirst = null;
    errorSecond = null;
  }else{
    if (openCards.length < 2) {
      openCards.push(e.currentTarget);
    }
  }
  if (openCards.length === 2) {
    const firstCard = openCards[0].dataset.value;
    const secondCard = openCards[1].dataset.value;
    const firstImg = openCards[0].firstChild;
    const secondImg = openCards[1].firstChild;
    if (firstCard === secondCard) {
      let self = this;
      openCards.forEach((card) => {
        card.removeEventListener("click", handleMatch);
        openCards = [];
        setTimeout(() => {
          card.classList.add("fade");

          // 定义一个函数来实现更快的抖动效果
          function shakeElement(element) {
            let angle = 50;
            const duration = 100; // 抖动持续时间
            const startTime = performance.now();

            function update() {
              const elapsed = performance.now() - startTime;
              if (elapsed < duration*5) {
                const delta = Math.sin(elapsed / duration * Math.PI * 2) * angle;
                element.style.transform = `rotate(${delta}deg)`;
                requestAnimationFrame(update);
              } else {
                element.style.transform = 'rotate(0deg)'; // 恢复初始角度
                let len = cardpool.children.length;
                let over = true;
                for (let i = 0; i < len; i++) {
                  card = cardpool.children[i];
                  if(!card.classList.contains("fade")){
                    over = false;
                    break;
                  }
                }

                if(over){
                  gameOver();
                }
              }
            }

            update();
          }

          // 对两个匹配的卡片元素同时应用抖动效果
          shakeElement(firstImg);
          shakeElement(secondImg);


        }, 1000);
      });
    } else {

      errorFirst = openCards[0];
      errorSecond = openCards[1];
      // 臨時屏蔽
      // unmatching = true;
      // errorTurns++;
      // const error = document.getElementById("error");
      // if (errorTurns <= currentMission) {
      //   assignTrigger();
      // } else {
      //   gameOver();
      //   errorTurns = 0;
      // }
      // error.innerHTML = `錯誤：${errorTurns}`;

      // setTimeout(() => {
      //   handleUnmatch();
      //   unmatching = false;
      // }, 2000);
    }
  }
}

function handleUnmatch() {
  openCards.forEach((card) => {
    card.classList.remove("open");
  });
  openCards = [];
}

function assignMission() {
  // const missionNum = getRandom(missions);
  // currentMission = missions[missionNum];
  const time = openTime/1000;
  mission.innerHTML = `<div class="mission-title">本次挑戰</div>${time} 秒看牌<button id="accept">接受挑戰</button>`;
      //`<div class="mission-title">本次挑戰</div>3 秒看牌，錯誤 ${currentMission} 次內配對所有牌卡 <button id="accept">接受挑戰</button>`;
  mission.style.visibility = "visible";
}

function assignTrigger() {
  // if (!errorTurns) {
  //   trigger.innerHTML = `<div></div>`;
  //   return;
  // }
  // const triggerNum = getRandom(triggers);
  // currentTrigger = triggers[triggerNum];
  // trigger.innerHTML = `<img id="bean" src=./public/svg/bean.svg><div class="trigger-inner"><div class="trigger-text">${currentTrigger}</div></div>`;
  // trigger.visibility = "visible";
}

function getRandom(arr) {
  if (arr.length === 0) return [];
  const arrTotal = arr.length - 1;
  const randomNum = (Math.random() * arrTotal).toFixed(0);
  return randomNum;
}

function clear(){
  errorFirst = null;
  errorSecond = null;
  openCards = [];
}

function gameOver() {
  const restart = document.getElementById("restart");
  lost = true;
  body.style.overflow = "hidden";
  // trigger.innerHTML = `<img id="bean" src=./public/svg/bean.svg><div class="trigger-inner"><div class="trigger-text">你太厉害了，请再来一局！</div></div>`;
  restart.style.visibility = "visible";
  restart.innerHTML =
    '<div class="mission-title">你太厉害了</div>再来一局？ <button id="restart-accept">再来一局</button>';
  document.getElementById("restart-accept").addEventListener("click", () => {
    restart.style.visibility = "hidden";
    lost = false;
    assignTrigger();
    startGame();
  });
}

window.onload = startGame();
