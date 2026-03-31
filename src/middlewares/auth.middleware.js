import jwt from "jsonwebtoken"
import User from "../models/user.models.js";

export const verifyJwt = async (req, res, next) => {
    try {
        // 1. Get token from cookies OR header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized request: No token provided" });
        }

        // 3. Verify Token (This will THROW an error if expired/invalid)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 4. Get updated profile from database
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // 5. Check if user STILL exists in the database
        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token: User no longer exists" });
        }

        // 6. Attach user to request and proceed
        req.user = user;
        next();

    } catch (error) {
        // If jwt.verify throws an error (e.g., TokenExpiredError), it gets caught here!
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid or Expired Access Token" });
    }
};