import Hapi from "@hapi/hapi";
import { createServer } from "../src/server";

describe("users endpoint", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("POST /users", () => {
    let userId: number;

    it("should throw error when required payload not exist", async () => {
      // arrange
      const requestPayload = {
        lastName: "test-last-name",
        email: `test-${Date.now()}@gmail.com`,
        social: {
          twitter: "thisistest",
          website: "https://www.thistest.com"
        }
      };

      // action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload
      });

      // assert
      expect(response.statusCode).toEqual(400);
    });

    it("should create user with correct payload", async () => {
      // arrange
      const requestPayload = {
        firstName: "test-first-name",
        lastName: "test-last-name",
        email: `test-${Date.now()}@gmail.com`,
        social: {
          twitter: "thisistest",
          website: "https://www.thistest.com"
        }
      };

      // action
      const response = await server.inject({
        method: "POST",
        url: "/users",
        payload: requestPayload
      });

      // assert
      expect(response.statusCode).toEqual(201);
      userId = JSON.parse(response.payload)?.id;
      expect(typeof userId === "number").toBeTruthy();
    });
  });
});
