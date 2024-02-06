const router = require("express").Router();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const randtoken = require("rand-token");

const jsonParser = bodyParser.json();

const login = "lera";
const password = "123";
const accessTokenLifetime = 10 * 1000; //10s
let refreshTokens = {};

app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/login", jsonParser, async (req, res) => {
  try {
    if (req.body.email !== login) {
      return res.status(404).send({
        message: "user not found",
      });
    }

    if (req.body.password !== password) {
      return res.status(400).send({
        message: "invalid credentials",
      });
    }
  } catch (e) {
    return res.status(400).send({
      message: "bad data",
    });
  }

  const newDateObj = new Date(Date.now() + accessTokenLifetime);

  const accessToken = jwt.sign(
    { _login: req.body.email, exp: newDateObj.getTime() },
    "secret"
  );
  const refreshToken = randtoken.uid(256);
  refreshTokens[refreshToken] = req.body.email;

  res.send({
    accessToken: accessToken,
    refreshToken: refreshToken,
    email: req.body.email,
  });
});

router.post("/refresh", jsonParser, async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.refreshToken && req.body.email && refreshTokens[req.body.refreshToken] == req.body.email) {
      delete refreshTokens[req.body.refreshToken];
      const newDateObj = new Date(Date.now() + accessTokenLifetime);

      const accessToken = jwt.sign(
        { _login: req.body.email, exp: newDateObj.getTime() },
        "secret"
      );
      const refreshToken = randtoken.uid(256);
      refreshTokens[refreshToken] = req.body.email;

      res.send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return;
    }
    return res.status(403).send({
      error: "not authed",
    });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({
      error: "error refresh",
    });
  }
});

router.get("/ping", async (req, res) => {
  try {
    const auth = req.headers["authorization"];
    const claims = jwt.verify(auth.split(" ")[1], "secret");

    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    if (Date.now() > claims.exp) {
      return res.status(401).send({
        message: "token expired",
      });
    }
    console.log("2");
    res.send({
      message: "you are authed",
    });
  } catch (e) {
    return res.status(500).send({
      message: "unauthenticated",
      e: e,
    });
  }
});

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:4200",
    ],
  })
);
app.use("/api", router);

app.listen(8000);
