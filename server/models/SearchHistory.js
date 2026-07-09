const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
{
    city:
    {
        type: String,
        required: true
    },

    country:
    {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);