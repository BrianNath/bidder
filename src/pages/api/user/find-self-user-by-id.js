import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function findSelfUserById(req, res) {
  try {
    const record = await pb.collection("users").getOne(req.user.userId, {
      expand: "roleId",
    });

    if (record) {
      res.status(200).json({ record, isOk: true });
    } else {
      res
        .status(400)
        .json({ error: { message: "Not Found Record" }, isOk: false });
    }
  } catch (error) {
    res.status(401).json({ error, isOk: false });
  }
}

export default authMiddlewareApi(findSelfUserById);
