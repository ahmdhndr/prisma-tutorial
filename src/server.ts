import * as dotenv from "dotenv";
import Hapi from "@hapi/hapi";

import status from "./plugins/status";
import prisma from "./plugins/prisma";
import users from "./plugins/users";

dotenv.config();

export const createServer = async () => {
  const server: Hapi.Server = Hapi.server({
    host: process.env.HOST ?? "localhost",
    port: process.env.PORRT ?? "5000"
  });

  await server.register([status, prisma, users]);

  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
