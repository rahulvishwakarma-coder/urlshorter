import { Router } from "express";
import { createShortUrl} from "../controllers/shorten.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const urlRouter = Router();





urlRouter.route("/shorten").post(verifyJwt,createShortUrl);
export { urlRouter };