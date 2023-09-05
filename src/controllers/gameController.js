export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const gameInfo = (req, res) => {
  return res.render("games/gameInfo", { pageTitle: "Game Info" });
};

export const play = (req, res) => {
  return res.render("games/play", { pageTitle: "Play Game" });
};
