const Dislike = require("../models/Dislike");
const Like = require("../models/Like");
const Video = require("../models/Video");
const Subsrciption = require("../models/Subsrciption");

const getAllVideos = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 12;
  const skip = (page - 1) * limit;
  const total = await Video.countDocuments();
  try {
    const video = await Video.find()
      .limit(limit)
      .skip(skip)
      .populate("writer")
      .sort("-createdAt");
    return res.json({
      success: true,
      videos: video,
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

const addNewVideo = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    if (!title || !description || !videoUrl)
      return res.status(400).json({
        success: false,
        message: "Missing paramaters!",
      });
    const newVideo = new Video({
      ...req.body,
      writer: req.userId,
    });
    await newVideo.save();
    return res.status(203).json({
      success: true,
      video: newVideo,
      message: "upload video success!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const getVideoById = async (req, res) => {
  const _id = req.params.id;

  try {
    const video = await Video.findOne({ _id }).populate("writer");
    if (!video)
      return res.status(400).json({
        success: false,
        message: "Video not found!",
      });

    const likeCount = await Like.find({ videoId: _id });
    const disLikeCount = await Dislike.find({ videoId: _id });
    const videoRecomment = await Video.find({ writer: video.writer })
      .populate("writer")
      .limit(6);

    return res.json({
      success: true,
      video,
      videoRecomment,
      likeCount: likeCount.length,
      disLikeCount: disLikeCount.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const likeVideo = async (req, res) => {
  const userId = req.userId;
  const videoId = req.body.videoId;

  try {
    const newLike = new Like({
      videoId,
      userId,
    });
    await newLike.save();

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const checkLikeVideo = async (req, res) => {
  let isLike = false;

  try {
    const check = await Like.find({
      videoId: req.params.videoId,
      userId: req.userId,
    });
    if (check.length !== 0) {
      isLike = true;
      return res.json({
        isLike,
      });
    }
    return res.json({
      isLike,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const unLikeVideo = async (req, res) => {
  try {
    const unlike = await Like.findOneAndDelete({
      videoId: req.params.videoId,
      userId: req.userId,
    });
    return res.json({
      success: true,
      message: "unlike success!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const disLikeVideo = async (req, res) => {
  const userId = req.userId;
  const videoId = req.body.videoId;

  try {
    const newLike = new Dislike({
      videoId,
      userId,
    });
    await newLike.save();

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const checkDisLikeVideo = async (req, res) => {
  let isDisLike = false;

  try {
    const check = await Dislike.find({
      videoId: req.params.videoId,
      userId: req.userId,
    });
    if (check.length !== 0) {
      isDisLike = true;
      return res.json({
        isDisLike,
      });
    }
    return res.json({
      isDisLike,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const unDisLikeVideo = async (req, res) => {
  try {
    const unlike = await Dislike.findOneAndDelete({
      videoId: req.params.videoId,
      userId: req.userId,
    });
    return res.json({
      success: true,
      message: "unlike success!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const getVideoSubsrciption = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 12;
  const skip = (page - 1) * limit;
  try {
    const videoSubsrciptions = await Subsrciption.find({ userId: req.userId });

    const channelId = [];
    videoSubsrciptions.forEach((videoSubsrciption) => {
      channelId.push(videoSubsrciption.channelId);
    });

    const total = await Video.countDocuments({ writer: { $in: channelId } });

    const results = await Video.find({ writer: { $in: channelId } })
      .populate("writer")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      videos: results,
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

const descView = async (req, res) => {
  try {
    const views = await Video.findOne({ _id: req.params.videoId });
    if (views.totalView) {
      views.totalView += 1;
      views.save();
    } else {
      views.totalView = 1;
      views.save();
    }

    return res.json({
      success: true,
      message: "Desc view success!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const getTrendingVideo = async (req, res) => {
  try {
    const videos = await Video.find()
      .limit(10)
      .sort("-totalView")
      .populate("writer");
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const searchVideo = async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm.trim()) {
    return res.status(400).json({
      success: false,
      message: "Missing paramaters!",
    });
  }

  try {
    const results = await Video.find({
      $text: { $search: searchTerm },
    })
      .populate("writer")
      .sort("-totalView");
    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server not found!",
    });
  }
};

const getLikeVideo = async (req, res) => {
  const userId = req.userId;

  try {
    const like = await Like.find({ userId });
    const videoIdLike = [];
    like.forEach((p) => videoIdLike.push(p.videoId));
    const videos = await Video.find({ _id: { $in: videoIdLike } }).populate(
      "writer"
    );
    return res.json({
      success: true,
      videos,
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
  getAllVideos,
  addNewVideo,
  getVideoById,
  likeVideo,
  checkLikeVideo,
  unLikeVideo,
  disLikeVideo,
  checkDisLikeVideo,
  unDisLikeVideo,
  getVideoSubsrciption,
  descView,
  getTrendingVideo,
  searchVideo,
  getLikeVideo,
};
