const mongoose = require("mongoose");
const schema = mongoose.Schema;

const gameSchema = new schema({
  randomNumber: {
    type: Number,
    required: true,
  },
});

const betSchema = new schema({
  periodId: {
    type: String,
    required: true,
  },
  luckyDrawNum: {
    type: Number,
    required: true,
  },
  totalBetAmt: {
    type: Number,
    required: true,
  },
  usersBetOn: [
    {
      userEmail: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
      selectedNum: {
        type: Number,
        required: true,
      },
      selectedClr: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      amountMultipliedBy: {
        type: Number,
        required: true,
      },
    },
  ],
});

const usersParityRecord = new schema({
  userEmail: {
    type: String,
    required: true,
  },
  bets: [
    {
      periodId: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      selectedClr: {
        type: String,
        required: true,
      },
      selectedNum: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      amountMultipliedBy: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Game = mongoose.model("game", gameSchema);
const Bet = mongoose.model("bet", betSchema);
const UsersParityRecord = mongoose.model(
  "usersParityRecord",
  usersParityRecord
);

module.exports = { Game, Bet, UsersParityRecord };
