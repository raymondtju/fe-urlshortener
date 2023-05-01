import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const query = req.query;
    const id = Array.isArray(query.value) ? query.value[0] : query.value;

    const {title, description} = req.body
    const session = await getCurrentUser(req, res);

    const checkAuth = await prisma.url.findFirst({
      where: {
        userId: session.id,
        urlId: id as string,
      },
    });
    if (!checkAuth) return res.status(401).send("Unauthorized");

    const changeMeta = await prisma.url.updateMany({
      where: {
        urlId: id,
      },
      data: {
        title,
        description
      }
    });
    if (!changeMeta) return res.status(400).send("Error changing meta.");

    return res.status(200).send("Successfully delete data.");
  } else {
    return res.status(405).send("Method not allowed");
  }
}
