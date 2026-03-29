import { Router } from "express";
import { createShortUrl} from "../controllers/shorten.controller.js";


const urlRouter = Router();





urlRouter.route("/shorten").post(createShortUrl);
export { urlRouter };