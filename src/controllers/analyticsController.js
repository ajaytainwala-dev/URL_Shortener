import Analytics from "../Database/models/Analytics.js";
import URL from "../Database/models/URL.js";

export const getAnalytics = async (req, res) => {
  try {
    const { shortUrlId } = req.params;
    const analytics = await Analytics.find({ shortUrlId });
    const url = await URL.findById(shortUrlId);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (!analytics || analytics.length === 0) {
      return res.status(404).json({ message: "Analytics not found" });
    }

    const clickTimestamps = analytics.map((a) => a.clickedAt);
    const browserUsage = analytics.reduce((acc, a) => {
      acc[a.browser] = (acc[a.browser] || 0) + 1;
      return acc;
    }, {});

    const osUsage = analytics.reduce((acc, a) => {
      acc[a.operatingSystem] = (acc[a.operatingSystem] || 0) + 1;
      return acc;
    }, {});

    const countryData = analytics.reduce((acc, a) => {
      acc[a.country] = (acc[a.country] || 0) + 1;
      return acc;
    }, {});

    res.render("analytics", {
      url,
      clickTimestamps,
      browserUsage,
      osUsage,
      countryData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
