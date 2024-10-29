const express = require("express");
const passport = require("passport");
const router = express.Router();

const ProjectObject = require("../models/project");
const UserObject = require("../models/user");
const ActivityObject = require("../models/activity");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const activeProjectsCount = await ProjectObject.countDocuments({ status: "active", organisation: req.user.organisation });
    const teamMembersCount = await UserObject.countDocuments({ organisation: req.user.organisation });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const activities = await ActivityObject.find({ organisation: req.user.organisation, date: { $gte: startOfMonth } });
    const budget = activities.reduce((acc, cur) => acc + cur.value, 0);

    const bestWorkers = await ActivityObject.aggregate([
      {
        $match: {
          organisation: req.user.organisation,
          date: { $gte: startOfMonth },
        },
      },
      {
        $addFields: {
          userIdObject: { $toObjectId: "$userId" },
          projectIdObject: { $toObjectId: "$projectId"}
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObject",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectIdObject",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$project" },
      {
        $group: {
          _id: "$userId",
          totalHours: { $sum: "$total" },
          userName: { $first: "$user.name"},
          userAvatar: { $first: "$user.avatar"},
          projects: {
            $push: { name: "$project.name", hours: "$total" },
          },
        },
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 },
    ])

    // Send response
    return res.status(200).send({
      ok: true,
      data: {
        activeProjectsCount,
        teamMembersCount,
        budget,
        bestWorkers,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
