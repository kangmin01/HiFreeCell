import Game from "../models/Game";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const games = async (req, res) => {
  const games = await Game.find({});

  return res.render("games/games", { pageTitle: "Games", games });
};

export const gameInfo = (req, res) => {
  return res.render("games/gameInfo", { pageTitle: "Game Info" });
};

export const play = (req, res) => {
  return res.render("games/play", { pageTitle: "Play Game" });
};

export const getCreateGame = async (req, res) => {
  const games = await Game.find({});

  return res.render("admin", { pageTitle: "admin", games });
};

const cards = [];

const generateCards = () => {
  const suits = ["clubs", "spades", "hearts", "diamonds"];
  const values = [1, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const colors = {
    clubs: "black",
    spades: "black",
    hearts: "red",
    diamonds: "red",
  };

  let suit, value, cardData;
  for (let i = 0; i < 52; i++) {
    suit = suits[i % 4];
    value = values[Math.floor(i / 4)];
    cardData = {
      id: i + 1,
      suit,
      value,
      color: colors[suit],
    };
    cards.push(cardData);
  }
};

const shuffleDeck = () => {
  let j, card_j;
  for (let i = 0; i < 52; i++) {
    j = Math.floor(52 * Math.random());
    card_j = cards[j];
    cards[j] = cards[i];
    cards[i] = card_j;
  }
};

const makeDeck = () => {
  generateCards();
  shuffleDeck();

  const deck = [[], [], [], [], [], [], [], []];

  for (let i = 0; i < 52; i++) {
    let card = cards[i];
    deck[i % 8].push(card);
  }

  return deck;
};

export const postCreateGame = async (req, res) => {
  const { num } = req.body;

  try {
    const games = await Game.find({});

    for (let i = 1; i <= num; i++) {
      const deck = makeDeck();
      await Game.create({
        number: games.length + i,
        deck,
      });
    }
  } catch (error) {
    return res.status(404).redirect("/admin");
  }
  return res.redirect("/admin");
};
