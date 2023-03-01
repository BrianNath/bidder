import { NextApiResponse, NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const authMiddlewareApi =
  (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    console.log(req.query)

    console.log("authHeader: ", authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    console.log("TOKEN: ", token);

    if (!token) {
      res.status(401).json({ message: "Unauthorized", status: 401 });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(decoded);
      return handler({ ...req, user: decoded }, res);
    } catch (err) {
      res.status(401).json({ message: "Unauthorized JWT", status: 401 });
      return;
    }
  };

export default authMiddlewareApi;
