import mongoose from "mongoose";
// Define the analytics schema
const AnalyticsSchema = new mongoose.Schema({
  shortUrlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "URL",
    required: true,
  },
 clicks:{
  type:Number,
  default:0,
 },
  clickedAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  userAgent: String,
  deviceType: String,
  browser: String,
  operatingSystem: String,
  referrer: String,
  country: String,
  city: String,
  language: String,
});

// Middleware to increment clicks before saving

// Create the Analytics model
const Analytics = mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;