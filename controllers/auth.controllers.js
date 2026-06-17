export const login = (req, res) => {
  const { password, rememberMe } = req.body;

  if (!password) {
    return res.status(400).json({ message: "password required" });
  }

  if (password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ message: "invalid password" });
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

export const logout = (req, res) => {
  res.clearCookie("vault_session", { signed: true });
  res.status(200).json({ message: "logged out" });
};

export const me = (req, res) => {
  if (req.signedCookies.vault_session === "authenticated") {
    return res.status(200).json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
};
