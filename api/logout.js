// /api/logout.js
export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    "firebaseToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax",
  );
  return res.status(200).json({ message: "Logout successful" });
}
