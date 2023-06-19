const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

// load address model
const Address = require("../../modals/Address");

// @route GET api/address
// @desc get adddress
// access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Address.find({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noProfile = "There is no address found for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
);

// @route POST api/add-address
// @desc add address
// access private
router.post(
  "/add-address",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // from bearer token, we get data as req.user.id
    const addressFields = {};
    addressFields.user = req.user.id;
    if (req.body.fullName) addressFields.fullName = req.body.fullName;
    if (req.body.mobileNum) addressFields.mobileNum = req.body.mobileNum;
    if (req.body.pincode) addressFields.pincode = req.body.pincode;
    if (req.body.state) addressFields.state = req.body.state;
    if (req.body.city) addressFields.city = req.body.city;
    if (req.body.detailedAddress)
      addressFields.detailedAddress = req.body.detailedAddress;

    Address.findOne({ fullName: req.body.fullName }).then((addressUnit) => {
      if (!addressUnit) {
        // create one
        const newAddress = new Address(addressFields);
        newAddress
          .save()
          .then((res) => res.json({ msg: "Address saved successfully!" }))
          .catch((err) => res.json(err));
        // res.json(new)
      }
      // update the found one
    });
  }
);

// @route POST api/edit-address/:id
// @desc route to edit address
// @access private
router.post(
  "/edit-address/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const addressFields = {};
    if (req.body.fullName) addressFields.fullName = req.body.fullName;
    if (req.body.mobileNum) addressFields.mobileNum = req.body.mobileNum;
    if (req.body.pincode) addressFields.pincode = req.body.pincode;
    if (req.body.state) addressFields.state = req.body.state;
    if (req.body.city) addressFields.city = req.body.city;
    if (req.body.detailedAddress)
      addressFields.detailedAddress = req.body.detailedAddress;
    Address.findOneAndUpdate({ _id: req.params.id }, { 
        $set: addressFields
    })
        .then(response => {
            if (!response) {
                return res.json({success: false, msg: 'Cannot update address'})
            }
            res.json(response);
        })
        .catch((err) => {
            
            res.status(500).json(err);
        })
  }
);

// @route POST api/delete-address/:id
// desc delete (document) an address by its id
// access PRIVATE
router.post('/delete-address/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
  // delete document by ID 
  Address.deleteOne({_id: req.params.id}).then((res) => {
    res.json(res);
  }).catch((err) => res.json(err));
})


module.exports = router;
