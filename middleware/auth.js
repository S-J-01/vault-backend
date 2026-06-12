export const requireAuth = (req, res, next) => {
  if (req.signedCookies.vault_session === "authenticated") {
    return next();
  }
  res.status(401).json({ message: "unauthorized" });
};
