const playFreecellBtn = document.querySelector(".btn_play_freecell");

const randomPlay = async () => {
  const response = await fetch("/api/game/play", {
    method: "GET",
  });
  const { length } = await response.json();
  const num = Math.floor((length + 1) * Math.random());
  window.location.href = `/games/${num}`;
};

playFreecellBtn.addEventListener("click", randomPlay);
