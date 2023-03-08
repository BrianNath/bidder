import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function getAllCategories(req, res) {
  try {
    const record = await pb.collection("categories").getFullList(200);

    if (record) {
      res.status(200).json({ record, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Not Found Record" }, isOk: false });
    }
  } catch (error) {
    res.json({ error, isOk: false });
  }
}

export default authMiddlewareApi(getAllCategories);
