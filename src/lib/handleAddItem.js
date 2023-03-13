import pb from "@/lib/pocketbase";

export default async function handleAddItem(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const createdRecordItems = await pb.collection("items").create(formData);

  if (createdRecordItems?.code == 400) {
    return null;
  }

  const auctionData = {
    itemId: createdRecordItems.id,
    creatorId: payload.creatorId,
    closePrice: 0,
    winnerOffer: null,
    timeStart: null,
    timeEnd: null,
    status: "Waiting",
  };

  const createdRecordAuction = await pb
    .collection("auctions")
    .create(auctionData);

  // console.log(createdRecordAuction);

  if (createdRecordAuction?.code == 400) {
    pb.collection("items").delete(createdRecordItems.id);
    return null;
  }

  return { createdRecordAuction, createdRecordItems };
}
