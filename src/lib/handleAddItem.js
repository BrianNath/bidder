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

  // const body = {
  //   title: event.target.title.value,
  //   itemName: event.target.itemName.value,
  //   quantity: event.target.quantity.value,
  //   condition: condition,
  //   creatorId: userData.id,
  //   categoryId: selectedCategory,
  //   openPrice: parseInt(openPrice.replace(/\./g, "")),
  //   description: richText,
  //   itemPicture: event.target.picture.files[0],
  // };

  const auctionData = {
    itemId: createdRecordItems.id,
    creatorId: payload.creatorId,
    closePrice: 0,
    winnerId: null,
    timeStart: null,
    timeEnd: null,
    status: "Waiting",
  };

  const createdRecordAuction = await pb
    .collection("auctions")
    .create(auctionData);

  if (createdRecordAuction?.code == 400) {
    return null;
  }

  return { createdRecordAuction, createdRecordItems };
}
