import pb from "@/lib/pocketbase";
import { deleteTokenCookie } from "@/utils/auth";

export default function logout(req, res) {
  if (req.method === "POST") {
    deleteTokenCookie(res);
    res.status(200).json({ message: "Logout successful", isOk: true });
    pb.authStore.clear();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
