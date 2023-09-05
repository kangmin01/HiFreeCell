export const userInfo = (req, res) => {
  return res.render("users/userInfo", { pageTitle: "User Info" });
};

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = (req, res) => {
  return res.end();
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = (req, res) => {
  return res.end();
};
