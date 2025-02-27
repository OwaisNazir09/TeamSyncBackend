const mongoose = require("mongoose");
const users = require("./user");

const personalnotes = new mongoose.Schema(
    {
        text: {
            type: String,
        },
        createdby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users", 
        },
    },
    { timestamps: true }
);

const notes = mongoose.model("notes", personalnotes);
module.exports = notes;