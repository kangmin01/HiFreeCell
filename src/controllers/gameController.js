import Game from "../models/Game";
import User from "../models/User";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const games = async (req, res) => {
  const {
    session: { user },
  } = req;
  const games = await Game.find({});
  const users = await User.findById(user._id)
    .populate("wonGame")
    .populate("lostGame");

  const wonGames = users.wonGame.map((x) => x.number);
  const lostGames = users.lostGame
    .map((x) => x.number)
    .filter((x) => !wonGames.includes(x));

  return res.render("games/games", {
    pageTitle: "Games",
    games,
    wonGames,
    lostGames,
  });
};

export const playGame = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findOne({ number: id });

  return res.render("games/playGame", {
    pageTitle: `Game #${game.number}`,
    game,
  });
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

export const successGame = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { time },
  } = req;

  try {
    const [game, player] = await Promise.all([
      Game.findOne({ number: id }),
      User.findById(user._id),
    ]);

    const hasUserPlayedGame = game.successfulUsers.includes(player._id);

    if (hasUserPlayedGame) return res.sendStatus(200);

    game.successfulUsers.push(player._id);
    if (!game.shortestTime || game.shortestTime > time) {
      game.shortestTime = time;
      game.topRanking = [player._id];
    } else if (game.shortestTime === time) {
      game.topRanking.push(player._id);
    }
    await game.save();

    player.wonGame.push(game._id);
    player.playTime.push(time);
    if (!player.shortestTime || player.shortestTime >= time) {
      player.shortestTime = time;
    }
    await player.save();

    const updatedGame = await Game.findById(game._id);

    return res.status(201).json({
      winRate: updatedGame.winRate,
      shortestTime: updatedGame.shortestTime,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "서버 오류 : 데이터베이스에 접근 중 오류 발생" });
  }
};

export const failGame = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { time },
  } = req;

  try {
    const [game, player] = await Promise.all([
      Game.findOne({ number: id }),
      User.findById(user._id),
    ]);

    const hasUserPlayedGame = game.failedUsers.includes(player._id);

    if (hasUserPlayedGame) return res.sendStatus(200);

    game.failedUsers.push(player._id);
    await game.save();

    player.lostGame.push(game._id);
    await player.save();

    const updatedGame = await Game.findById(game._id);

    return res.status(201).json({
      winRate: updatedGame.winRate,
      shortestTime: updatedGame.shortestTime,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "서버 오류 : 데이터베이스에 접근 중 오류 발생" });
  }
};

export const randomPlayGame = async (req, res) => {
  try {
    const games = await Game.find({});
    return res.status(201).json({ length: games.length });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "서버 오류 : 데이터베이스에 접근 중 오류 발생" });
  }
};
