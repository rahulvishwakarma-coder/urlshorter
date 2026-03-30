import {UrlModel} from "../models/url.models.js"
import {urlCache} from "../utils/localCache.js"

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

export const createShortUrl = async (req, res) => {
  try {
    let { originalUrl, title, customCode } = req.body;

    // normalize
    customCode = customCode?.toLowerCase();

    // 1. validate URL
    if (!originalUrl || originalUrl.trim().length === 0) {
      return res.status(400).json({ message: "Original URL is required" });
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

    // 5. save to DB
    const newUrl = await UrlModel.create({
      originalUrl,
      title:title || originalUrl,
      shortCode,
    });

    // 6. response
    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const redirectUser = async (req, res) => {
  try {
    // 1. extract shortCode
    const code = req.params.shortCode;

    // 2. reserved routes check
    const reservedRoutes = ["api", "admin", "dashboard"];

    if (reservedRoutes.includes(code)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // check in cached memory
    const originalUrl = urlCache.get(code);
    console.log(originalUrl);

    if(originalUrl){
      return res.redirect(originalUrl);
    }

    // 3. find in DB
    const url = await UrlModel.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // store url in cached
    urlCache.set(url.shortCode,url.originalUrl);

    // 4. expiry check
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ message: "Link expired" });
    }

    // 5. increment clicks
    // url.clicks += 1;
    // await url.save();

    // 6. redirect
    return res.redirect(url.originalUrl);

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};