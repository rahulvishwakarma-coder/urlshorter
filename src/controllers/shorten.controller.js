import { UrlModel } from "../models/url.models.js"
import redis from "../utils/redisCache.js";

// helper
const generateShortCode = (length = 6) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let shortCode = "";
  for (let i = 0; i < length; i++) {
    shortCode += characters[Math.floor(Math.random() * characters.length)];
  }
  return shortCode;
};

const isValidCustomCode = (input) => {
  const regex = /^[a-zA-Z0-9_-]{4,10}$/;
  return regex.test(input);
};

export const updateClicks = async (shortCode) => {
  try {
    // $inc is ATOMIC - it handles the math inside the database
    const updatedUrl = await UrlModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true } // Returns the updated document instead of the old one
    );

    return updatedUrl;
  } catch (error) {
    console.error("Error updating clicks:", error);
    return null;
  }
};

export const createShortUrl = async (req, res) => {
  try {
    let { originalUrl, title, customCode } = req.body;

    // normalize
    customCode = customCode?.toLowerCase();

    // 1. validate URL
    if (!originalUrl || originalUrl.trim().length === 0) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    // validation url
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ message: "Invalid URL" })
    }

    // 2. validate custom code (only if provided)
    if (customCode && !isValidCustomCode(customCode)) {
      return res.status(400).json({ message: "Invalid custom code" });
    }

    let shortCode = "";

    // 3. custom code flow
    if (customCode) {
      const exists = await UrlModel.findOne({ shortCode: customCode });

      if (exists) {
        return res
          .status(409)
          .json({ message: "Short code already in use" });
      }

      shortCode = customCode;
    } else {
      // 4. generate unique code
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        const generatedCode = generateShortCode();

        const exists = await UrlModel.findOne({
          shortCode: generatedCode,
        });

        if (!exists) {
          shortCode = generatedCode;
          break;
        }

        attempts++;
      }

      if (!shortCode) {
        return res
          .status(500)
          .json({ message: "Failed to generate unique short code" });
      }
    }

    const OneMonth = 30 * 24 * 60 * 60 * 1000

    // 0. Token limit check
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.tokensUsed >= req.user.tokenLimit) {
      return res.status(403).json({ message: "Token limit reached. Please upgrade your account." });
    }

    // 5. save to DB
    const newUrl = await UrlModel.create({
      originalUrl,
      title: title || originalUrl,
      shortCode,
      creator: req.user?._id,
      expiresAt: new Date(Date.now() + OneMonth)
    });

    // 6. Update user token count
    await req.user.updateOne({ $inc: { tokensUsed: 1 } });

    // 7. response
    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
      remainingTokens: req.user.tokenLimit - (req.user.tokensUsed + 1)
    });
  } catch (error) {
    console.log(`Error during createShort URL ${error}`)
    return res.status(500).json({ message: "Server error" });
  }
};

export const redirectUser = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Reserved routes check
    const reservedRoutes = ["api", "admin", "dashboard", "auth"];
    if (reservedRoutes.includes(shortCode)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    // 2. Check Redis Cache
    const cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
      // Fire and Forget click update (Non-blocking)
      updateClicks(shortCode).catch(err => console.error("Click Update Error:", err));
      return res.redirect(302, cachedUrl);
    }

    // 3. Cache Miss: Find in DB
    const url = await UrlModel.findOne({ shortCode });

    if (!url) {
      // Optional: Cache the "404" for 1 minute to prevent DB spam (Negative Caching)
      return res.status(404).json({ message: "Link not found" });
    }

    // 4. Expiry Check (DO THIS BEFORE CACHING)
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).json({ message: "This link has expired" });
    }

    // 5. Store in Redis with TTL (e.g., 24 hours = 86400 seconds)
    // This prevents memory leaks
    await redis.set(shortCode, url.originalUrl, { ex: 36000 });

    // 6. Update clicks and Redirect
    updateClicks(shortCode).catch(err => console.error("Click Update Error:", err));

    return res.redirect(302, url.originalUrl);

  } catch (error) {
    console.error("Redirect Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserUrls = async (req, res) => {
  try {
    // get creatorId 
    const userId = req.user._id;

    // fetch all urls from database
    const urls = await UrlModel.find({ creator: userId })
      .sort({ createdAt: -1 }) // Newest first
      .select("-__v");

    //send all urls as a response

    return res.status(201).json({success:true,urls,count:urls.length})

  } catch (error) {
    console.log(`Dashboard Error ${error}`);
    return res.status(500).json({message:"Internal server Error"});
  }
}

export const deleteUrls = async (req, res) => {
  try {
    // 1. Get the shortCode from the request body
    const { shortCode } = req.body;
    
    // 2. Get the user's ID (Assuming you have authentication middleware that sets req.user)
    // If your auth setup is different, adjust this variable accordingly!
    const userId = req.user._id; 

    // 3. Find and delete with TWO conditions (await is crucial here!)
    const deletedUrl = await UrlModel.findOneAndDelete({
      shortCode: shortCode,
      creator: userId      // This ensures only the owner can delete this specific URL
    });

    // 4. Check if a document was actually found and deleted
    if (!deletedUrl) {
      return res.status(404).json({ 
        success: false, 
        message: "URL not found or you are not authorized to delete it." 
      });
    }
    
    await redis.del(shortCode);

    // 5. Send a success response back to the client
    return res.status(200).json({ 
      success: true, 
      message: "URL successfully deleted.",
      deletedUrl 
    });

  } catch (error) {
    // 6. Handle any server/database errors safely
    console.error("Error deleting URL:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};