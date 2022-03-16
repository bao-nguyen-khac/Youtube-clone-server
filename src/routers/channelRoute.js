const express = require("express");
const route = express.Router();
const {
  getChannelInfo,
  getChannelVideo,
} = require("../controllers/channelControllers");

// GET
// get info channel
route.get("/:id", getChannelInfo);

// GET
// get videos channel
route.get("/video/:id", getChannelVideo);

module.exports = route;
