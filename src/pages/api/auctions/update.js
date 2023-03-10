import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function update(req, res) {
  try {
    console.log(req.body.id)
    const record = await pb
      .collection("auctions")
      .update(req.body.id, req.body.data);
      

    if (record) {
      res.status(200).json({ record, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Failed To Update" }, isOk: false });
    }
  } catch (error) {
    res.json({ error, isOk: false });
  }
}

export default authMiddlewareApi(update);
