import { Router } from "express";
import { createShortUrl,getUserUrls,deleteUrls,redirectUser} from "../controllers/shorten.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const urlRouter = Router();

urlRouter.route("/shorten").post(verifyJwt,createShortUrl);
urlRouter.route("/getUrls").post(verifyJwt,getUserUrls);
urlRouter.route("/deleteUrl").delete(verifyJwt,deleteUrls);
urlRouter.route("/redirected").get(redirectUser);

export { urlRouter };