import Hapi from "@hapi/hapi";
import { createServer } from "../src/server";

describe("HTTP Server", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(() => {
    server.stop();
  });

  describe("Status plugin", () => {
    it("should response with 200 code", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/"
      });

      expect(res.statusCode).toEqual(200);
      const response = JSON.parse(res.payload);
      expect(response.up).toEqual(true);
    });
  });
});
