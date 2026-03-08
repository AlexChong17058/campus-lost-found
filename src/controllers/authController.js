const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing in .env");
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name, email: email.toLowerCase(), passwordHash });

    res.status(201).json({ message: "Registered" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = (email || "").toLowerCase().trim();
    password = (password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Always return success-looking response (prevents account enumeration)
    if (!email) return res.json({ message: "If that email exists, a reset link has been sent." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });

    // Create a token, store hashed version
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await user.save();

    // For now, just return the token (DEV ONLY).
    // In production you would email a link like:
    // https://yourdomain.com/auth/reset-password.html?token=RAW_TOKEN&email=user@example.com
    res.json({
      message: "If that email exists, a reset link has been sent.",
      devResetToken: rawToken
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};