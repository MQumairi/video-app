import supertest from "supertest";
import app from "../app";

const request = supertest(app);

test("displays error page", async () => {
  const res = await request.get("/error");
  expect(res.statusCode).toBe(404);
  expect(res.body).toMatchObject({ message: "page not found" });
});
