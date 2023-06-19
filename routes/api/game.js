const express = require("express");
const passport = require("passport");
const router = express.Router();

const { Game } = require("../../modals/game");
const { Bet } = require("../../modals/game");
const { UsersParityRecord } = require("../../modals/game");

// @route POST api/game/random-num
// @desc return random-number and store that to db
// access private
router.post("/random-num", (req, res) => {
  const num = Math.random();
  const randomNumber = +num?.toFixed(1) * 10;
  const numberModelInstance = new Game({
    randomNumber,
  });

  numberModelInstance
    .save()
    .then((response) => {
      // res.json(response);
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// @route POST api/game/bet-period
// @desc return success, if saved successfully
// access private
router.post(
  "/bet-period",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      periodId,
      userEmail,
      luckyDrawNum,
      amount,
      selectedNum,
      selectedClr,
      status,
      amountMultipliedBy,
      // totalBetAmt,
    } = req?.body;

    let betData = {}
    let parityCont = {}

    betData.userEmail = userEmail;
    betData.amount = amount;
    betData.selectedNum = selectedNum;
    betData.selectedClr = selectedClr;
    betData.status = status;
    betData.amountMultipliedBy = amountMultipliedBy;

    parityCont.periodId = periodId;
    parityCont.amount = amount;
    parityCont.selectedClr = selectedClr;
    parityCont.selectedNum = selectedNum;
    parityCont.status = status; // won / lost
    parityCont.amountMultipliedBy = amountMultipliedBy; // investment amt

    Bet.findOneAndUpdate(
      { periodId: periodId },
      {
        $push: { usersBetOn: betData },
        $set: { luckyDrawNum: luckyDrawNum },
        $inc: { totalBetAmt: Number(amount) }
      },
      {
        new: true,
        upsert: true,
      }
    )
      .then((betdata) => {
        UsersParityRecord.findOneAndUpdate(
          { userEmail: userEmail },
          {
            $push: { bets: parityCont },
          },
          {
            new: true,
            upsert: true,
          }
        )
          .then((userBetData) => {
            console.log(userBetData);
          })
          .catch((err) => {
            res.status(500).send(err);
          });

        res.json(betdata);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
);

// @route GET api/game/getAllParityRecords
// @desc returns all the records of bets i.e. return every period data
// access private
router.post(
  "/getAllPeriodRecords",
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    const {limit, offset} = req.body
    let count = 0;

    await Bet.find().then((el) => count = el.length).catch((err) => console.log('err'))
    await Bet.find().skip(offset).limit(limit)
      .then((periodsList) => {
        // send only entries with number < limit 
        // send starting from offset
        // if limit/offset === 0 i.e. offset = 10 , limit multiple of 10 
        res.json({periodsList: periodsList, totalLen: count});
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

// @route POST api/game/getCurrentUserParityRecord
// @desc returns a list of all periods current user have ever bet on
// acess PRIVATE
router.post(
  "/getCurrentUserParityRecord",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const currentUserEmail = req.body.userEmail;
    UsersParityRecord.find({userEmail: currentUserEmail})
      .then((currentUserPeriodsList) => {
        res.json(currentUserPeriodsList);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
);

module.exports = router;
