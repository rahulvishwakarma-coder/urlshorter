import express from "express"
import cors from "cors"
const app = express();

//setup middlewares

app.use(cors());
app.use(express.json());

// import routers

import {urlRouter} from "./src/routes/url.routes.js";
import {redirectUser} from "./src/controllers/shorten.controller.js"
import connectDB from "./src/db/index.js";

connectDB();

app.get('/', (req, res) => {
  res.redirect("https://github.com/rahulvishwakarma-coder/urlshorter");
  // res.json({ message: 'hello this is urlshorter application' });
});
app.get("/:shortCode",redirectUser)
app.use("/api/url",urlRouter);

export default app;