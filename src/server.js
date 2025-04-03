import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectToMongo from "./Database/db.js";
import authRoute from "./routes/authRoute.js";
import urlRoute from "./routes/urlRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import profileRoute from "./routes/profileRoute.js";
import QR_Routes from "./routes/QR_Routes.js";
import analyticsRoute from "./routes/analyticsRoute.js";
import cors from "cors";
dotenv.config();


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}
const app = express();
connectToMongo();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const __dirname = path.resolve();
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "src/public")));

app.use("/auth", authRoute);
app.use("/", urlRoute);
app.use("/", profileRoute);
app.use("/", contactRoutes);
app.use("/", QR_Routes);
app.use("/",analyticsRoute);
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/page/faq",(req,res)=>{
  res.render("faq.ejs");
})

app.use((req, res, next) => {
  res.status(404).render("404");
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 127.0.0.1:${process.env.PORT}`);
});
