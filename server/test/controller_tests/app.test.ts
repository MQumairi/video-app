import supertest from "supertest";
import app, { not_found_error } from "../../src/app";

const request = supertest(app);

test("displays error page", async () => {
  const res = await request.get("/error");
  expect(res.statusCode).toBe(404);
  expect(res.body).toMatchObject(not_found_error);
});
