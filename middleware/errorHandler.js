import mongoose from "mongoose";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "invalid id" });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message =
    status === 500 ? "internal server error" : err.message || "error";
  res.status(status).json({ message });
};
