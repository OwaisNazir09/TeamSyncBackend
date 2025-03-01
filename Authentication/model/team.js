const mongoose = require("mongoose");
const users = require("./user");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    },
    { timestamps: true }
);

const Team = mongoose.model("team", teamSchema);
module.exports = Team;
