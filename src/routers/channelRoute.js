const express = require("express");
const route = express.Router();
const {
  getChannelInfo,
  getChannelVideo,
  updateChannel,
} = require("../controllers/channelControllers");
const IsLogin = require("../middleware/IsLogin");

// GET
// get info channel
route.get("/:id", getChannelInfo);

// GET
// get videos channel
route.get("/video/:id", getChannelVideo);

// PUT
// update channel
route.put("/user", IsLogin, updateChannel);

module.exports = route;
