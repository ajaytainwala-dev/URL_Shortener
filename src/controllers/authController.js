import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Database/models/User.js";
import express from "express";
import sendEmail from "../utils/RestPass.js";
import crypto from "crypto";

export const register = async (req, res) => {
  res.render("register.ejs");
};
export const login = async (req, res) => {
  res.render("login.ejs");
};
export const doRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log(name, email, password);
      return res.json({
        error: "Please fill all the fields",
      });
    }
    const user = await User.find({ email: email });
    if (user.length > 0) {
      return res.json({
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.json({
      message: `User registered successfully `,
      token: token,
    });
  } catch (error) {
    res.json({
      error: "Something went wrong",
      message: error.message,
    });
  }
};

export const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user.length == 0) {
      return res.json({ error: "User not found" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.json({ error: "Invalid password" });
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user: user, token: token });
  } catch (error) {
    res.json({ error: "Something went wrong" });
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }
  const resetToken = await user.getResetPasswordToken();
  console.log(resetToken);
  await user.save();
  const resetUrl = `http://localhost:3000/auth/resetpassword/${resetToken}`;
  const message = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
  </head>
  
  
  
  <body style=" margin: 0;
  padding: 0;
  box-sizing: border-box;font-family: 'Roboto', sans-serif;
  background-color: #f4f4f4;">
      <div class="container" style="width: 100%;
          padding: auto;">
          <div class="header" style="background-color: rgb(22, 26, 57);
          padding: 10px;
          text-align: center;">
              <h4 style="color: white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  fill="white" 
                      viewBox="0 0 16 16">
                      <path
                          d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                  </svg><br>Please Reset Password
              </h4>
          </div>
          <div class="text-container" style=" background-color: white;
          padding: 20px;
          border-radius: 5px;">
              <p><span style="  font-size: 1.2rem;
                  font-weight: 500;
                  line-height: 2rem;">Hello ${user.name},</span> <br>
                  We have sent this email in response to your request to reset your Password. <br><br>To reset
                  your Password , please follow the link below:</p>
              <div>
                  <a href=${resetUrl} clicktracking="off" target="_">
                      <button type="button" class="btn" clicktracking="off" target="_blank" style="  background-color: rgb(22, 26, 57);
                      color: white;
                      padding: 0 10px;
                      border-radius: 8px;
                      border: none;
                      cursor: pointer;
                      text-decoration: none;
                      margin: 10px;">
                          <h4>Reset Password</h4>
                      </button>
                  </a>
                  <div class="ignore-text" style="  font-size: 0.8rem;
                  color: rgb(22, 26, 57);
                  text-align: left;line-height: 1.2rem;">*Please ignore this email if did not
                      request a Password change</div>
              </div>
          </div>
          <div class="foot" style=" background-color: rgb(22, 26, 57);
          padding: 1rem;
          text-align: center;">
              <h4 class="  p-3 text-left" style="color: white;"> &copy; Project | All rights reserved
                  <?php echo date("Y"); ?>
              </h4>
  
          </div>
      </div>
  </body>
  
  </html>`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Password rest request",
      text: message,
    });
    res
      .status(201)
      .json({ success: true, message: "Email sent successfully,Check Inbox" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({
      success: false,
      message: "Email could not be sent,Please try again later",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(201).json({ success: true, message: "Password Reset Success" });
};

