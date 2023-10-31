const playFreecellBtn = document.querySelector(".btn_play_freecell");

const randomPlay = async () => {
  const response = await fetch("/api/game/play", {
    method: "GET",
  });
  const { gamesNum } = await response.json();
  const num = Math.floor(gamesNum.length * Math.random());
  window.location.href = `/games/${num + 1}`;
};

playFreecellBtn.addEventListener("click", randomPlay);

// 슬라이드
const slideContainer = document.querySelector(".slide_container");
const slide = document.querySelector(".slide");
const imgWidth = document.querySelector(".slide img").clientWidth;

const slideList = slide.querySelectorAll("li");
const slideLen = slideList.length;
const slideSpeed = 300;

const cloneFirst = slideList[0].cloneNode(true);
slide.appendChild(cloneFirst);

let currentIdx = 0;
let translate = 0;

const showSliding = () => {
  setInterval(() => {
    translate -= imgWidth;
    slide.style.transform = `translateX(${translate}px)`;
    slide.style.transition = `all ${slideSpeed}ms ease`;
    currentIdx++;

    if (currentIdx === slideList.length) {
      setTimeout(() => {
        slide.style.transition = "none";
        currentIdx = 0;
        translate = 0;
        slide.style.transform = "none";
      }, slideSpeed);
    }
  }, 4000);
};

showSliding();
