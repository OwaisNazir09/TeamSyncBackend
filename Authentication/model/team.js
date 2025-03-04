const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        logo: {
            type: String,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const Team = mongoose.model("team", teamSchema);
module.exports = Team;
