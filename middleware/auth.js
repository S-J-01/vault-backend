import { HttpError } from "./errorHandler.js";

export const requireAuth = (req, res, next) => {
  const sessionUserId = req.signedCookies.vault_session;
  if (sessionUserId === "authenticated" || sessionUserId) {
    req.user = {
      id:
        sessionUserId === "authenticated"
          ? process.env.AUTH_USER_ID || "default"
          : sessionUserId,
    };
    return next();
  }
  next(new HttpError(401, "unauthorized"));
};
