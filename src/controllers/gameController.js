export const home = (req, res) => {
  const game = {
    title: 1,
    deck: [
      [
        { id: 7, suit: "hearts", value: 13, color: "red" },
        { id: 22, suit: "spades", value: 9, color: "black" },
        { id: 9, suit: "clubs", value: 12, color: "black" },
        { id: 30, suit: "spades", value: 7, color: "black" },
        { id: 15, suit: "hearts", value: 11, color: "red" },
        { id: 39, suit: "hearts", value: 5, color: "red" },
        { id: 5, suit: "clubs", value: 13, color: "black" },
      ],
      [
        { id: 34, suit: "spades", value: 6, color: "black" },
        { id: 11, suit: "hearts", value: 12, color: "red" },
        { id: 10, suit: "spades", value: 12, color: "black" },
        { id: 40, suit: "diamonds", value: 5, color: "red" },
        { id: 48, suit: "diamonds", value: 3, color: "red" },
        { id: 4, suit: "diamonds", value: 1, color: "red" },
        { id: 24, suit: "diamonds", value: 9, color: "red" },
      ],
      [
        { id: 31, suit: "hearts", value: 7, color: "red" },
        { id: 20, suit: "diamonds", value: 10, color: "red" },
        { id: 8, suit: "diamonds", value: 13, color: "red" },
        { id: 42, suit: "spades", value: 4, color: "black" },
        { id: 27, suit: "hearts", value: 8, color: "red" },
        { id: 21, suit: "clubs", value: 9, color: "black" },
        { id: 41, suit: "clubs", value: 4, color: "black" },
      ],
      [
        { id: 43, suit: "hearts", value: 4, color: "red" },
        { id: 28, suit: "diamonds", value: 8, color: "red" },
        { id: 18, suit: "spades", value: 10, color: "black" },
        { id: 12, suit: "diamonds", value: 12, color: "red" },
        { id: 32, suit: "diamonds", value: 7, color: "red" },
        { id: 17, suit: "clubs", value: 10, color: "black" },
        { id: 33, suit: "clubs", value: 6, color: "black" },
      ],
      [
        { id: 3, suit: "hearts", value: 1, color: "red" },
        { id: 6, suit: "spades", value: 13, color: "black" },
        { id: 23, suit: "hearts", value: 9, color: "red" },
        { id: 37, suit: "clubs", value: 5, color: "black" },
        { id: 44, suit: "diamonds", value: 4, color: "red" },
        { id: 46, suit: "spades", value: 3, color: "black" },
      ],
      [
        { id: 13, suit: "clubs", value: 11, color: "black" },
        { id: 1, suit: "clubs", value: 1, color: "black" },
        { id: 19, suit: "hearts", value: 10, color: "red" },
        { id: 35, suit: "hearts", value: 6, color: "red" },
        { id: 50, suit: "spades", value: 2, color: "black" },
        { id: 49, suit: "clubs", value: 2, color: "black" },
      ],
      [
        { id: 45, suit: "clubs", value: 3, color: "black" },
        { id: 29, suit: "clubs", value: 7, color: "black" },
        { id: 51, suit: "hearts", value: 2, color: "red" },
        { id: 36, suit: "diamonds", value: 6, color: "red" },
        { id: 16, suit: "diamonds", value: 11, color: "red" },
        { id: 14, suit: "spades", value: 11, color: "black" },
      ],
      [
        { id: 38, suit: "spades", value: 5, color: "black" },
        { id: 52, suit: "diamonds", value: 2, color: "red" },
        { id: 2, suit: "spades", value: 1, color: "black" },
        { id: 26, suit: "spades", value: 8, color: "black" },
        { id: 47, suit: "hearts", value: 3, color: "red" },
        { id: 25, suit: "clubs", value: 8, color: "black" },
      ],
    ],
    ResolvedUser: "",
    unresolvedUser: "",
    winRate: "",
  };
  return res.render("home", { pageTitle: "Home", game });
};

export const games = (req, res) => {
  return res.render("games/games", { pageTitle: "Games" });
};

export const gameInfo = (req, res) => {
  return res.render("games/gameInfo", { pageTitle: "Game Info" });
};

export const play = (req, res) => {
  return res.render("games/play", { pageTitle: "Play Game" });
};
