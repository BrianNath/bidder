import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function getAuctionsLazy(req, res) {
  console.log("req:", req);
  const { params } = req.query;
  const [offset, limit] = params.split(".");
  console.log("PARAMS:", params);
  try {
    const record = await pb.collection("auctions").getList(offset, limit, {
      filter: "",
      expand: "creatorId,itemId,itemId.categoryId",
    });

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

export default authMiddlewareApi(getAuctionsLazy);
