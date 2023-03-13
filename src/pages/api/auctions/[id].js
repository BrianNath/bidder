import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function findAuctionById(req, res) {
  const { id } = req.query;
  try {
    const record = await pb.collection("auctions").getOne(id, {
      expand: "creatorId,itemId,itemId.categoryId,operatorUserId,winnerOffer,winnerOffer.bidderId",
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

export default authMiddlewareApi(findAuctionById);
