const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const { Server } = require("socket.io");
const { createServer } = require("http");
const axios = require("axios");
const cron = require("node-cron");
const moment = require("moment/moment");

const app = express();
const httpServer = createServer(app);
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const users = require("./routes/api/users");
const address = require("./routes/api/address");
const gameAll = require("./routes/api/game");
const { Bet } = require("./modals/game");

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// db config
const db = require("./config/keys").mongoURI;

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log(err);
  });

// use routes
app.use("/api/users", users);
app.use("/api/address", address);
app.use("/game/", gameAll);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", async () => {
  const job = cron.schedule("*/3 * * * *", async () => {
    let response = {};
    await axios
      .post("http://localhost:4000/game/random-num")
      .then((res) => {
        response = {
          randomNumber: res?.data?.randomNumber,
          id: res?.data?._id,
          timeExpires: moment().add({ minutes: 2, seconds: 30 }),
        };

        console.log(response, "response", Date(), "date now");
        io.emit("api", response);
      })
      .catch((err) => {
        console.log(err, "err");
        io.emit("api", {
          randomNumber: null,
          id: null,
        });
      });
  });
  job.start();
});

cron.schedule("* 23 */2 * *", () => { // every two days, schedule randomNum schema to get empty
  console.log('in cron ---------------------')
  Bet.deleteMany({});
})

httpServer.listen(port, () => {
  console.log("server running at localhost:4000");
});
