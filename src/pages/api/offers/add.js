import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function addOffers(req, res) {
  try {
    // console.log("body:", req.body);
    const record = await pb.collection("offers").create(req.body);

    if (record) {
      res.status(200).json({ record, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Failed To Add" }, isOk: false });
    }
  } catch (error) {
    res.status(404).json({ error, isOk: false });
  }
}

export default authMiddlewareApi(addOffers);
