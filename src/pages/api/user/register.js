import pb from "@/lib/pocketbase";

export default async function register(req, res) {
  try {
    const record = await pb.collection("users").create(req.body);
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
