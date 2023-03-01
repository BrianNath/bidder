import jwt from "jsonwebtoken";
import pb from "@/lib/pocketbase";

export default async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !username) {
    return res.status(400).json({ error: "Invalid Request", isOk: false });
  }

  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password);

    if (pb.authStore.isValid) {
      const token = jwt.sign(
        { userId: authData.record.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_PERIOD,
          algorithm: "HS256",
        }
      );

      res.setHeader("Set-Cookie", `authToken=${token}; Path=/`);

      res.status(200).json({ token, isOk: true });
    }
  } catch (error) {
    res.status(401).json({ error });
  }
}
