import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      transports: ["websocket"],
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL!, // MUST match the client
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true, // if using cookies/sessions
      },
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
