import express from "express";
import nodemailer from "nodemailer";
import sendEmail from "../utils/sendEmail.js";

export const getContacts = (req, res) => {
    res.render("contact.ejs");
}

export const createContact = (req,res)=>{
    try {
        const {name,email,subject,message} = req.body;
        sendEmail({
            name,
            email,
            subject,
            message
        });
        res.status(200).json({
            success:true,
            message:"Email sent successfully"
        });
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error sending email"
        });
    }
}