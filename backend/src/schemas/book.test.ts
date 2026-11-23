import { expect, test } from "bun:test";
import { listQuerySchema } from "./book";

test("query vacía usa los defaults", () => {
  expect(listQuerySchema.parse({})).toEqual({ q: "", sort: "createdAt", order: "desc", page: 1, limit: 10 });
});

test("valores inválidos caen al default y los válidos se convierten", () => {
  expect(listQuerySchema.parse({ q: " tolkien ", sort: "$where", order: "x", page: "3", limit: "999" })).toEqual({
    q: "tolkien",
    sort: "createdAt",
    order: "desc",
    page: 3,
    limit: 10,
  });
});
