import jwt from "jsonwebtoken";
import pb from "@/lib/pocketbase";

export default async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !username) {
    return res.status(400).json({ error: "Invalid Request", isOk: false });
  }

  // console.log("USERNAME:",username)
  // console.log("PASSWORD:",username)

  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password);

    // console.log(req.body);
    // console.log(authData);
    // console.log(pb.authStore.isValid);

    if (pb.authStore.isValid) {
      const token = jwt.sign(
        { userId: authData.record.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_PERIOD,
          algorithm: "HS256",
        }
      );
      // console.log("TOKEN", token);
      res.setHeader("Set-Cookie", `authToken=${token}; Path=/`);

      res.status(200).json({ token, isOk: true });
    }
  } catch (error) {
    res.status(400).json({
      error,
      isOk: false,
    });
  }
}
