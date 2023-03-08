import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function getItemImageUrlByAuctionId(req, res) {
  const { id, options } = req.query;

  try {
    const record = await pb
      .collection("auctions")
      .getOne(id, { expand: "itemId" });
    // console.log(record.expand.itemId.itemPicture);
    const imageURL = record.expand.itemId.itemPicture;
    const url = pb.getFileUrl(record.expand.itemId, imageURL, JSON.parse(options));

    if (record) {
      res.status(200).json({ url, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Not Found Record" }, isOk: false });
    }
  } catch (error) {
    res.json({ error, isOk: false });
  }
}

export default authMiddlewareApi(getItemImageUrlByAuctionId);
