import User from "../models/user.models.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // 1. Fetch the user document from MongoDB
        const user = await User.findById(userId);

        // 2. Generate tokens using the instance methods we created in User model
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // 3. PERSISTENCE: Save the refresh token to the database
        // This is required so we can verify it later when the access token expires
        user.refreshToken = refreshToken;

        // Use validateBeforeSave: false to skip password validation/re-hashing 
        // since we are only updating one field
        await user.save({ validateBeforeSave: false });


        return { accessToken, refreshToken };

    } catch (error) {
        // Log for the developer (Server-side)
        console.error("Token Generation Error:", error);

        // THROW the error so the calling controller can catch it 
        // and send a proper 500 response
        throw new Error("Internal Server Error: Token generation failed");
    }
};

export const register = async (req, res) => {
    try {
        // 1. Get fields from user
        const { email, password, fullName } = req.body;

        // 2. Check all required fields are not empty
        if (!fullName || !email || !password || 
            [fullName, email, password].some((field) => typeof field === "string" && field.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 3. Check if user already exists
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // 4. Store user in database
        const user = await User.create({
            fullName,
            email,
            password,
        });

        // 5. Check if user creation was successful
        if (!user) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        // 6. Sanitize the response
        const sanitizedUser = user.toObject();
        delete sanitizedUser.password;
        delete sanitizedUser.refreshToken;
        delete sanitizedUser.__v;

        return res.status(201).json({
            message: "User registered successfully",
            user: sanitizedUser,
        });

    } catch (error) {
        console.error("Registration Error Detailed:", error);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User (Vague error for security)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Compare Password
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Generate BOTH Tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // 4. Sanitize User Data (Fixing the typo)
        const loggedInUser = {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified, // Corrected spelling
            tokenLimit: user.tokenLimit,
            tokensUsed: user.tokensUsed
        };

        const options = {
            httpOnly: true,
            secure:true, // Best practice
            sameSite: "none"
        };

        // 5. Set BOTH Cookies
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Login Successful",
                user: loggedInUser,
                accessToken,
                refreshToken
            });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        // 1. Single DB Trip: Update the document directly in MongoDB
        // $unset completely removes the field, which is cleaner than setting to null
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 }
            }
        );

        // 2. Exact Match Options: Must match your login options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        };

        // 3. Clear Cookies and Respond
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "Logout Successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refreshToken = async (req, res) => {

    try {
        // get refresh token from cookies
        const refreshToken = req.cookies?.refreshToken;

        //check refreshToken exist or not
        if (!refreshToken) return res.status(401).json({ message: "Unauthroized Access" })

        // verify and check vaild or not
        const tokenDetails = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!tokenDetails) return res.status(401).json({ message: "Invalid Token" });

        // check user in data by id
        const user = await User.findById(tokenDetails._id);

        if (!user) return res.status(401).json({ message: "Unauthorized Access" });

        // Match refreshToken from database

        if(!(refreshToken == user.refreshToken)) return res.status(401).json({message:"Invalid Token"});

        // generate refresh and accessToken
        const { accessToken, refreshToken:newRefreshToken} = await generateAccessAndRefreshTokens(user._id);

        //set refresh and accessToken in cookie
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        }
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "RefreshToken generated successfully" })
    } catch (error) {
        console.log(`Error during generation of new access and refreshToken ${error}`)
        return res.status(401).json({message:"Invalid or expired refresh token"})
    }
};

export const getCurrentUser = async (req, res) => {
    return res
        .status(200)
        .json({
            success: true,
            user: req.user,
            message: "User fetched successfully"
        });
};