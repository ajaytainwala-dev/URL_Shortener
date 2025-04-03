import express from "express";
import { nanoid } from "nanoid";
import URL from "../Database/models/URL.js";
import Analytics from "../Database/models/Analytics.js";

export const shortenURL = async (req, res) => {
  try {
    const user = req.user;
    const customURL = req.query.customURL;
  
    if (customURL) {
      const existingCustomURL = await URL.findOne({
        shortURL: customURL,
        user: user.id,
      });
      if (existingCustomURL) {
        return res
          .status(400)
          .json({ customUrlError: "Custom URL is already taken" });
      }
    }
    if (!user || !user.id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const longURL = req.params.longURL;
    if (!longURL) {
      return res.status(400).json({ message: "URL is required" });
    }
    const existingURL = await URL.findOne({ url: longURL, user: user.id });
    if (existingURL) {
      return res.json({ longURL, shortURL: existingURL.shortURL });
    }
    if (customURL) {
      const newURL = new URL({
        url: longURL,
        shortURL: customURL,
        user: user.id,
      });
      await newURL.save();
      return res.json({
        longURL: longURL,
        shortURL: customURL,
        id: newURL._id,
      });
    }
    const shortURL = nanoid(6);
    const newURL = new URL({
      url: longURL,
      shortURL: shortURL,
      user: user.id,
    });
    await newURL.save();

    res.json({ longURL: longURL, shortURL: shortURL, id: newURL._id });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const redirectURL = async (req, res) => {
  try {
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({ shortURL });
    // console.log(url,url._id)
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    url.clicks++;
    await url.save();

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

    const ip =
      req.headers["x-forwarded-for"] ||
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.ip;
    console.log(ip);
    // Get geolocation info from IP address
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const ipInfo = await response.json();
    const country = ipInfo.country || "Unknown";
    const city = ipInfo.city || "Unknown";
    // Create analytics entry
    const analytics = new Analytics({
      shortUrlId: url._id ? url._id.toString() : undefined,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: userAgent,
      clicks: url.clicks,
      deviceType: deviceType,
      browser: browser,
      operatingSystem: operatingSystem,
      referrer: req.headers.referer || "Direct",
      language: req.headers["accept-language"] || "Unknown",
      country: country, // Replace with geolocation service
      city: city, // Replace with geolocation service
    });

    await analytics.save();

    res.status(302).redirect(url.url);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteURL = async (req, res) => {
  try {
    const urlID = req.params.urlId;
    if (!urlID) {
      return res.status(400).json({ message: "URL ID is required" });
    }
    const url = await URL.findByIdAndDelete(urlID);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
