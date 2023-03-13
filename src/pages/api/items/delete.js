import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function deleteItems(req, res) {
  try {
    console.log("BODY:", req.body);
    await pb.collection("items").delete(req.body.id);

    const message = `Deleted user with id ${req.body.id}`;
    res.status(200).json({ message, isOk: true });
  } catch (error) {
    res.status(404).json({ error, isOk: false });
  }
}

export default authMiddlewareApi(deleteItems);
