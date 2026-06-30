import { HttpError } from "../middleware/errorHandler.js";

export const login = async (req, res) => {
  const { password, rememberMe } = req.body;

  if (!password) {
    throw new HttpError(400, "password required");
  }

  if (password !== process.env.AUTH_PASSWORD) {
    throw new HttpError(401, "invalid password");
  }

  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  res.cookie("vault_session", "authenticated", {
    httpOnly: true,
    signed: true,
    maxAge,
    sameSite: "lax",
  });
  res.status(200).json({ message: "logged in" });
};

export const logout = async (req, res) => {
  res.clearCookie("vault_session", { signed: true });
  res.status(200).json({ message: "logged out" });
};

export const me = async (req, res) => {
  if (req.signedCookies.vault_session === "authenticated") {
    return res.status(200).json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
};
