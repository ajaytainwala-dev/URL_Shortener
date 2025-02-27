import express from "express";
import { nanoid } from "nanoid";
import URL from "../Database/models/URL.js";

export const shortenURL = async (req, res) => {
  try {
    const user = req.user;
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

    const shortURL = nanoid(6);
    const newURL = new URL({
      url: longURL,
      shortURL: shortURL,
      user: user.id,
    });
    await newURL.save();

    res.json({ longURL: longURL, shortURL: shortURL });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const redirectURL = async (req, res) => {
  try {
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({ shortURL });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    url.clicks++;
    await url.save();
    res.status(302).redirect(url.url);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
