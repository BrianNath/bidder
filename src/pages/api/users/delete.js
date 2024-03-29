import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function deleteUser(req, res) {
  try {
    letmessage = `Deleted user with id ${req.body.id}`;
    console.log("id:", req.body.id);
    await pb.collection("users").delete(req.body.id);

    res.status(200).json({ message, isOk: true });
  } catch (error) {
    res.status(404).json({ error, isOk: false });
  }
}

export default authMiddlewareApi(deleteUser);
