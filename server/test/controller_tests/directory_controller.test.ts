import supertest from "supertest";
import app, { not_found_error } from "../../src/app";
import { root_dir_object, dir_1_object, sub_dir_object } from "../directory.test";

const request = supertest(app);

test("can load directories", async () => {
  const root_res = await request.get("/api/directories/data");
  expect(root_res.statusCode).toBe(200);
  expect(root_res.body).toMatchObject(root_dir_object);

  const dir_1_res = await request.get("/api/directories/data%2Fdir_1");
  expect(dir_1_res.statusCode).toBe(200);
  expect(dir_1_res.body).toMatchObject(dir_1_object);

  const sub_dir_res = await request.get("/api/directories/data%2Fdir_1%2Fsub_dir");
  expect(sub_dir_res.statusCode).toBe(200);
  expect(sub_dir_res.body).toMatchObject(sub_dir_object);

  const null_res = await request.get("/api/directories/test_test_I_dont_exist");
  expect(null_res.statusCode).toBe(404);
  expect(null_res.body).toMatchObject(not_found_error);
});
