import pb from "@/lib/pocketbase";

export default async function register(req, res) {
  try {
    // console.log("REQ BODY:", req.body);
    const record = await pb.collection("users").create(req.body);
    if (record) {
      res.status(200).json({ record, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Error Register" }, isOk: false });
    }
  } catch (error) {
    res.json({ error, isOk: false });
  }
}
