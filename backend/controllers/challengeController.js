const Challenge = require("../models/Challenge");

const getAllChallenges = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;

    const challenges = await Challenge.find(filter).populate("createdBy", "name");
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("createdBy", "name");
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

const createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: "Challenge created", data: challenge });
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }
    res.status(200).json({ success: true, message: "Challenge deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllChallenges, getChallengeById, createChallenge, updateChallenge, deleteChallenge };
