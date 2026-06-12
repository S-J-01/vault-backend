export const login = (req, res) => {
  if (req.body.password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ message: "invalid password" });
  }
  res.cookie("vault_session", "authenticated", {
    httpOnly: true,
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
