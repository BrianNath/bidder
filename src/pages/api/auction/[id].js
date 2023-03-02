import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function getAuctionById(req, res) {
  const { id } = req.query;
  console.log("id:", id);
  try {
    const record = await pb.collection("auctions").getOne(id, {
      expand: "bidderId,itemId,operatorUserId,categoryId",
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

export default authMiddlewareApi(getAuctionById);
