import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ====================== REGISTER ======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.googleId && !existingUser.password) {
        return res.status(400).json({ message: "An account with this email exists via Google. Please sign in with Google." });
      }
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account was created using Google. Please sign in with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET CURRENT USER ======================
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== UPDATE USER PROFILE ======================
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== GOOGLE LOGIN ======================
export const googleLogin = async (req, res) => {
  try {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      return res.status(400).json({ message: "Google auth token is required" });
    }

    let payload;

    if (accessToken) {
      // Fetch user profile from Google UserInfo API using access_token
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch userinfo: ${response.statusText}`);
        }
        payload = await response.json();
      } catch (err) {
        console.error("Fetch Google UserInfo Error:", err);
        return res.status(401).json({ message: "Failed to fetch Google user profile" });
      }
    } else if (credential) {
      try {
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          payload = ticket.getPayload();
        } else {
          // Fallback for development decoding
          const decodedStr = Buffer.from(credential.split(".")[1], "base64").toString("utf-8");
          payload = JSON.parse(decodedStr);
        }
      } catch (verifyError) {
        console.error("Google Token Verification Error:", verifyError);
        return res.status(401).json({ message: "Invalid Google token" });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid payload from Google token" });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    if (user) {
      // Update googleId or avatar if missing
      const updateData = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (!user.avatar && picture) updateData.avatar = picture;

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
      }
    } else {
      // Create new user with Google details
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          googleId,
          avatar: picture || null,
          password: null
        }
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Google authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Server error during Google authentication" });
  }
};