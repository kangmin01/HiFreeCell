import User from "../models/User";
import bcrypt from "bcrypt";
require("dotenv").config();

const isFly = process.env.NODE_ENV === "production";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const {
    body: { name, username, email, password, password2 },
    file,
  } = req;
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
    if (username === "admin") {
      await User.create({
        name,
        username,
        email,
        avatar: isFly ? file.location : file.path,
        password,
        role: "admin",
      });
      return res.redirect("/login");
    }
    await User.create({
      name,
      username,
      email,
      avatar: isFly ? file.location : file.path,
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
  req.session.isFly = isFly;

  if (username === "admin") {
    req.session.admin = true;
    return res.redirect("/admin");
  } else {
    req.session.user = user;
    return res.redirect("/");
  }
};

export const googleOauth = (req, res) => {
  const baseUri = "https://accounts.google.com/o/oauth2/v2/auth";
  const config = {
    client_id: process.env.GG_CLIENT,
    response_type: "code",
    redirect_uri: isFly
      ? `${process.env.HF_URL}/users/oauth/google/callback`
      : "http://localhost:3000/users/oauth/google/callback",
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
    redirect_uri: isFly
      ? `${process.env.HF_URL}/users/oauth/google/callback`
      : "http://localhost:3000/users/oauth/google/callback",
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
    const { email, name, picture } = userData;
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        name,
        username: email.split("@")[0],
        email,
        avatar: picture,
        socialOnly: true,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    req.session.isFly = isFly;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const kakaoOauth = (req, res) => {
  const baseUri = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KA_CLIENT,
    redirect_uri: isFly
      ? `${process.env.HF_URL}/users/oauth/kakao/callback`
      : "http://localhost:3000/users/oauth/kakao/callback",
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
    redirect_uri: isFly
      ? `${process.env.HF_URL}/users/oauth/kakao/callback`
      : "http://localhost:3000/users/oauth/kakao/callback",
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
        avatar: userData.kakao_account.profile.thumbnail_image_url,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.isFly = isFly;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, avatar },
    },
    body: { name, username, email },
    file,
  } = req;

  const existsUsername = await User.findOne({ _id: { $ne: _id }, username });
  const existsEmail = await User.findOne({ _id: { $ne: _id }, email });

  if (existsUsername || existsEmail) {
    return res.status(400).render("edit-profile", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatar: file ? (isFly ? file.location : file.path) : avatar,
        name,
        username,
        email,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
  } catch (error) {
    return res.status(404).render("users/edit-profile", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getChangePassword = (req, res) => {
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  try {
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);

    if (!ok) {
      return res.status(400).render("users/change-password", {
        pageTitle,
        errorMessage: "The current password is incorrect.",
      });
    }

    if (newPassword !== newPasswordConfirmation) {
      return res.status(400).render("users/change-password", {
        pageTitle,
        errorMessage: "The password does not match the cofirmation.",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).render("users/change-password", {
        pageTitle,
        errorMessage: "The old password equals new password",
      });
    }
    user.password = newPassword;
    await user.save();
    req.session.destroy();
    return res.redirect("/login");
  } catch (error) {
    return res.status(404).render("users/edit-profile", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const userInfo = async (req, res) => {
  let {
    params: { id },
    session: { user },
  } = req;

  const isOwner = id === user._id ? true : false;

  user = await User.findById(id);

  function secondsToHms(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return hours === 0
      ? `${formattedMinutes} : ${formattedSeconds}`
      : `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  }

  const userData = {
    won: user.wonGame.length,
    lost: user.lostGame.length,
    total: user.wonGame.length + user.lostGame.length,
    winRate: (
      (user.wonGame.length / (user.wonGame.length + user.lostGame.length)) *
      100
    ).toFixed(0),
    short: user.shortestTime ? secondsToHms(user.shortestTime) : "-",
    avg: user.playTime.length
      ? secondsToHms(
          (
            user.playTime.reduce((acc, currentValue) => acc + currentValue, 0) /
            user.playTime.length
          ).toFixed(0)
        )
      : "-",
  };

  return res.render("users/userInfo", {
    pageTitle: "User Info",
    user,
    userData,
    isOwner,
  });
};
