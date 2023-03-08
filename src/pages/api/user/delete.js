import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function deleteUser(req, res) {
  try {
    let message = "Failed to delete, Rollback trigerred";
    console.log("body:", req.body);
    await pb.collection("users").delete(req.body.id);

    if (record) {
      message = `Deleted user with id ${req.bod.id}`;
      res.status(200).json({ message, isOk: true });
    } else {
      res.status(400).json({ error: { message }, isOk: false });
    }
  } catch (error) {
    res.status(401).json({ error, isOk: false });
  }
}

export default authMiddlewareApi(deleteUser);
