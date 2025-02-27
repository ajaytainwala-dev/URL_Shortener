// node mailer allows you to send email
import nodemailer from "nodemailer";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    service: "gmail",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Quick URL",
      address: process.env.EMAIL_FROM,
    },
    to: process.env.EMAIL_FROM,
    subject: options.subject,
    html: `
    <p>${options.name}</p>
    <p>${options.message}</p>
    <p>${options.email}</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;
