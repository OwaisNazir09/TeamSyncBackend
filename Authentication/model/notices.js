const mongoose = require("mongoose");
const users = require("./user");
const teams = require("./team");

const noticesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team",
            required: true,
        },
    },
    { timestamps: true }
);

const Notices = mongoose.model("notices", noticesSchema);
module.exports = Notices;
