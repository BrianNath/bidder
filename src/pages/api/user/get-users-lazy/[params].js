import pb from "@/lib/pocketbase";
import authMiddlewareApi from "@/middleware/authMiddlewareApi";

async function getUsersLazy(req, res) {
  // console.log("req:", req);
  const { params } = req.query;
  const [offset, limit] = params.split(".");
  // console.log("PARAMS:", params);
  try {
    const record = await pb.collection("users").getList(offset, limit, {
      filter: "username != 'master_admin'",
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
    res.json({ error, isOk: false });
  }
}

export default authMiddlewareApi(getUsersLazy);
