import { Router } from "express";
import { register ,login,logout,refreshToken, getCurrentUser} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();


userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(verifyJwt,logout);
userRouter.route("/me").get(verifyJwt, getCurrentUser);
userRouter.route("/refreshAccessToken").post(refreshToken);

export default userRouter;