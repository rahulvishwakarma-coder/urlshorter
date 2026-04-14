import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

//setup middlewares

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// import routers

import {urlRouter} from "./src/routes/url.routes.js";
import {redirectUser} from "./src/controllers/shorten.controller.js"
import userRouter from "./src/routes/user.routes.js";
import connectDB from "./src/db/index.js";

connectDB();

app.get('/', (req, res) => {
  res.redirect("https://github.com/rahulvishwakarma-coder/urlshorter");
  // res.json({ message: 'hello this is urlshorter application' });
});
// app.get("/:shortCode",redirectUser)
app.use("/api/url",urlRouter);
app.use("/api/auth/v1",userRouter);

export default app;