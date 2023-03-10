import pb from "@/lib/pocketbase";

//GET ALL ROLES EXCEPT ADMINISTATOR
async function getAllRolesRegister(req, res) {
  try {
    const record = await pb
      .collection("roles")
      .getFullList(200, { filter: "roleName != 'officer'" });

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

export default getAllRolesRegister;
