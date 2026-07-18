const requests = new Map();

const windowMs =
  Number(process.env.MEMORIES_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const maxRequests = Number(process.env.MEMORIES_RATE_LIMIT_MAX) || 200;

export const memoriesRateLimit = (req, res, next) => {
  const key = req.ip || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1000),
    );
    res.set("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({ message: "too many requests" });
  }

  entry.count += 1;
  next();
};
