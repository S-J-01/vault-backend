import { HttpError } from "./errorHandler.js";

export const requireAuth = (req, res, next) => {
  if (req.signedCookies.vault_session === "authenticated") {
    return next();
  }
  next(new HttpError(401, "unauthorized"));
};
