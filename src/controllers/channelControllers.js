const Subsrciption = require("../models/Subsrciption");
const User = require("../models/User");
const Video = require("../models/Video");

const getChannelInfo = async (req, res) => {
  const channelId = req.params.id;

  try {
    const channel = await User.findOne({ _id: channelId }).select("-password");
    const subsrciptionCount = await Subsrciption.find({ channelId: channelId });
    if (!channel) {
      return res.status(400).json({
        success: false,
        message: "Channel not found!",
      });
    }

    return res.json({
      success: true,
      channel,
      subsrciptionCount: subsrciptionCount.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const getChannelVideo = async (req, res) => {
  const channelId = req.params.id;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 4;
  const skip = (page - 1) * limit;

  try {
    const total = await Video.countDocuments({ writer: channelId });
    const videos = await Video.find({ writer: channelId })
      .skip(skip)
      .limit(limit)
      .populate("writer")
      .sort("-createdAt");
    return res.json({
      success: true,
      videos,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const updateChannel = async (req, res) => {
  const userId = req.userId;
  try {
    const updated = await User.findOneAndUpdate(
      { _id: userId },
      { ...req.body }
    );

    return res.json({
      success: true,
      channel: req.body,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

module.exports = {
  getChannelInfo,
  getChannelVideo,
  updateChannel,
};
