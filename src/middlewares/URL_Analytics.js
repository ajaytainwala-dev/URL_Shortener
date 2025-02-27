import Analytics from "../Database/models/Analytics.js";
const trackAnalytics = async (req, res, next) => {
  // Continue with the request processing if this is not a short URL access
  if (!req.params.shortURL) {
    console.log(req.params.shortURL)
    return next();
  }

  try {
    // Extract device info from user agent
    const userAgent = req.headers["user-agent"] || "Unknown";

    // Basic device type detection
    let deviceType = "Unknown";
    if (/mobile/i.test(userAgent)) deviceType = "Mobile";
    else if (/tablet/i.test(userAgent)) deviceType = "Tablet";
    else if (/windows|macintosh|linux/i.test(userAgent)) deviceType = "Desktop";

    // Basic browser detection
    let browser = "Unknown";
    if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent)) browser = "Safari";
    else if (/edge/i.test(userAgent)) browser = "Edge";
    else if (/opera/i.test(userAgent)) browser = "Opera";
    else if (/msie|trident/i.test(userAgent)) browser = "Internet Explorer";

    // Basic OS detection
    let operatingSystem = "Unknown";
    if (/windows/i.test(userAgent)) operatingSystem = "Windows";
    else if (/macintosh|mac os/i.test(userAgent)) operatingSystem = "macOS";
    else if (/linux/i.test(userAgent)) operatingSystem = "Linux";
    else if (/android/i.test(userAgent)) operatingSystem = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) operatingSystem = "iOS";

    // Create analytics entry
    const analytics = new Analytics({
    //   shortUrlId: req.params.shortURL,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: userAgent,
      deviceType: deviceType,
      browser: browser,
      operatingSystem: operatingSystem,
      referrer: req.headers.referer || req.headers.referrer || "Direct",
      language: req.headers["accept-language"] || "Unknown",
      // Note: For country and city, you would typically use
      // a geolocation service based on IP address
      country: "Unknown", // Replace with geolocation service
      city: "Unknown", // Replace with geolocation service
    });

    // Save analytics asynchronously without blocking the response
    analytics
      .save()
      .catch((err) => console.error("Error saving analytics:", err));

    // Continue with the request handling
    next();
  } catch (error) {
    console.error("Analytics middleware error:", error);
    // Still continue with the request even if analytics fails
    next();
  }
};

export default trackAnalytics;