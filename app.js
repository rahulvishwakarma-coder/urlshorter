import express from "express"
const app = express();

//setup middlewares

app.use(express.json());

// import routers

import {urlRouter} from "./src/routes/url.routes.js";
import {redirectUser} from "./src/controllers/shorten.controller.js"
import connectDB from "./src/db/index.js";

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});
app.get("/:shortCode",redirectUser)
app.use("/api/url",urlRouter);

export default app;