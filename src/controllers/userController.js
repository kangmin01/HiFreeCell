import { render } from "pug";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  const pageTitle = "Join";

  if (!password || password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return (
      res.status(404),
      render("join", { pageTitle, errorMessage: error._message })
    );
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const googleOauth = (req, res) => {
  const baseUri = "https://accounts.google.com/o/oauth2/v2/auth";
  const config = {
    client_id: process.env.GG_CLIENT,
    response_type: "code",
    redirect_uri: "http://localhost:4000/users/oauth/google/callback",
    scope: "email profile",
  };
  const params = new URLSearchParams(config).toString();
  const finalUri = `${baseUri}?${params}`;
  return res.redirect(finalUri);
};

export const googleOauthCallback = async (req, res) => {
  const baseUri = "https://oauth2.googleapis.com/token";
  const config = {
    code: req.query.code,
    client_id: process.env.GG_CLIENT,
    client_secret: process.env.GG_SECRET,
    redirect_uri: "http://localhost:4000/users/oauth/google/callback",
    grant_type: "authorization_code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUri = `${baseUri}?${params}`;
  const tokenRequest = await (
    await fetch(finalUri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUri = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;
    const userData = await (
      await fetch(apiUri, {
        headers: { authorization: `Bearer ${access_token}` },
      })
    ).json();
    const { email, name } = userData;
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        name,
        username: email.split("@")[0],
        email,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const kakaoOauth = (req, res) => {
  const baseUri = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KA_CLIENT,
    redirect_uri: "http://localhost:4000/users/oauth/kakao/callback",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUri = `${baseUri}?${params}`;
  return res.redirect(finalUri);
};

export const kakaoOauthCallback = async (req, res) => {
  const baseUri = "	https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KA_CLIENT,
    redirect_uri: "http://localhost:4000/users/oauth/kakao/callback",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUri = `${baseUri}?${params}`;
  const tokenRequest = await (
    await fetch(finalUri, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUri = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUri, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    ).json();

    if (
      !userData.kakao_account.is_email_valid ||
      !userData.kakao_account.is_email_verified
    ) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: userData.kakao_account.email });
    if (!user) {
      user = await User.create({
        name: userData.kakao_account.profile.nickname,
        username: userData.kakao_account.profile.nickname,
        email: userData.kakao_account.email,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const userInfo = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  return res.render("users/userInfo", { pageTitle: "User Info", user });
};
