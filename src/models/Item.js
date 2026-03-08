const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // NEW: owner of the report
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, required: true, enum: ["Lost", "Found"] },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },
    contactInfo: { type: String, required: true, trim: true, maxlength: 120 },

    status: {
      type: String,
      enum: ["Active", "Claimed", "Resolved"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);