import pb from "@/lib/pocketbase";

export default async function handleUpdateItem(payload) {
  console.log("PAYLOAD ", payload);
  const formData = new FormData();

  const updateRecordItems = await pb
    .collection("items")
    .update(payload.id, payload.body);

  if (updateRecordItems?.code == 400) {
    return null;
  }

  return updateRecordItems;
}
